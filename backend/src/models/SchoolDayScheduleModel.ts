import { Knex } from "knex";
import knexDB, { knexDBHelpers } from "../utils/db";

class SchoolDayScheduleModel {
    static async getFirstDay() {
        const result = await knexDB('school_day_schedule')
                            .orderBy('date')
                            .first();

        return result;
    }

    static async getToday() {
        return await this.getByDate(knexDBHelpers.CURRENT_DATE);
    }

    static async getByDate(date: string | Knex.Raw) {
        const result = await knexDB('school_day_schedule')
                        .where('date', date)
                        .first();

        return result;
    }

    static async getHolidays(month: number, year: number) {
        const result =  await knexDB('school_day_schedule')
                        .select([
                            'date',
                            'holiday_reason'
                        ]).whereRaw(`
                            is_holiday = TRUE 
                            AND EXTRACT(MONTH FROM date) = ?
                            AND EXTRACT(YEAR FROM date) = ?
                        `, [month, year]);

        return result;
    }

    static async getSchooldays(month: number, year: number) {
        const result = await knexDB('school_day_schedule')
                        .select([
                            'date'
                        ]).whereRaw(`
                            (is_holiday = FALSE OR is_holiday IS NULL)
                            AND EXTRACT(MONTH FROM date) = ?
                            AND EXTRACT(YEAR FROM date) = ?
                        `, [month, year]);

        return result;
    }

    static async createSchedules(dates: string[], policy: any) {
        const {
            is_holiday,
            holiday_reason,
            checkin_start_time,
            checkin_end_time,
            checkout_start_time,
            checkout_end_time
        } = policy;

        await knexDB.transaction(async function() {
            for (const date of dates) {
                await knexDB('school_day_schedule').where('date', date).delete();
                await knexDB('school_day_schedule').insert({
                    date,
                    is_holiday,
                    holiday_reason,
                    checkin_start_time,
                    checkin_end_time,
                    checkout_start_time,
                    checkout_end_time
                });
            }
        });

        return true;
    }
}

export default SchoolDayScheduleModel;