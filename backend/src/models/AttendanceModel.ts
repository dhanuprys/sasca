import knexDB, { knexDBHelpers } from "../utils/db";

class AttendanceModel {
    static async getCheckPoint(checkType: 'in' | 'out' | string, studentId: number, date?: string) {
        if (checkType === 'in') {
            return AttendanceModel.getCheckIn(studentId, date);
        }

        if (checkType === 'out') {
            return AttendanceModel.getCheckOut(studentId, date);
        }

        return AttendanceModel.getFullCheckPoint(studentId, date);
    }

    static async getFullCheckPoint(studentId: number, date?: string) {
        console.log('GET FULL CHECK POINT');
        
        return await knexDB('attendances').where({
            student_id: studentId,
            date: date || knexDBHelpers.currentDate()
        }).first();
    }

    static async getCheckIn(studentId: number, date?: string) {
        const result = await knexDB('attendances').select([
            'id',
            'check_in_time',
            'check_in_coordinate',
            'date'
        ]).where({ 
            student_id: studentId,
            date: date || knexDBHelpers.currentDate()
        }).first();

        if (!result || !result.check_in_time) {
            return null;
        }

        return result;
    }

    static async getCheckOut(studentId: number, date?: string) {
        const result = await knexDB('attendances').select([
            'id',
            'check_out_time',
            'check_out_coordinate',
            'date'
        ]).where({
            student_id: studentId,
            date: date || knexDBHelpers.currentDate()
        }).first();

        if (!result || !result.check_out_time) {
            return null;
        }

        return result;
    }
}

export default AttendanceModel;