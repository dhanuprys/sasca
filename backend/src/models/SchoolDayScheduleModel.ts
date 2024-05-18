import { Knex } from "knex";
import knexDB, { knexDBHelpers } from "../utils/db";

class SchoolDayScheduleModel {
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
}

export default SchoolDayScheduleModel;