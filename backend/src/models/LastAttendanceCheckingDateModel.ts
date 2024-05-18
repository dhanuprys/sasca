import knexDB from "../utils/db";

class LastAttendanceCheckingDateModel {
    static async getLastCheckDate() {
        const result = await knexDB('last_attendance_checking_date')
                            .orderBy('last_check_date', 'desc')
                            .first();

        return result ? result.last_check_date : null;
    }

    static async addLastDate(date: string) {
        const result = await knexDB('last_attendance_checking_date')
                            .insert({
                                last_check_date: date
                            });

        return result;
    }
}

export default LastAttendanceCheckingDateModel;