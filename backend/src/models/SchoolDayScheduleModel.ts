import knexDB, { knexDBHelpers } from "../utils/db";

class SchoolDayScheduleModel {
    static async getToday() {
        return await knexDB('school_day_schedule')
                        .where('date', knexDBHelpers.currentDate())
                        .first();
    }
}

export default SchoolDayScheduleModel;