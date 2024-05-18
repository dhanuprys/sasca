import { Knex } from "knex";
import knexDB, { knexDBHelpers } from "../utils/db";
import SchoolDayScheduleModel from "./SchoolDayScheduleModel";
import { DateTime } from "luxon";
import AttendanceStatus from "../constant/AttendanceStatus";
import StudentModel from "./StudentModel";

type Coordinates = [number, number];
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
        return await knexDB('attendances').where({
            student_id: studentId,
            date: date || knexDBHelpers.CURRENT_DATE
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
            date: date || knexDBHelpers.CURRENT_DATE
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
            date: date || knexDBHelpers.CURRENT_DATE
        }).first();

        if (!result || !result.check_out_time) {
            return null;
        }

        return result;
    }

    static async checkIn(studentId: number, coordinates: Coordinates, time?: string | Knex.Raw, date?: string | Knex.Raw) {
        const studentCheckIn = await AttendanceModel.getCheckIn(studentId);
        const todaySchedule = await SchoolDayScheduleModel.getToday();
        const now = DateTime.now().toFormat('HH:mm:ss');

        // Jika user sudah absen sebelumnya
        if (studentCheckIn) {
            return null;
        }

        // Jika tidak ada jadwal hari ini
        if (!todaySchedule || now < todaySchedule.checkin_start_time || now > todaySchedule.checkout_end_time) {
            return null;
        }

        time = time || knexDBHelpers.CURENT_TIME;
        date = date || knexDBHelpers.CURRENT_DATE;

        const result = await knexDB('attendances')
            .insert({
                student_id: studentId,
                check_in_time: time,
                check_in_coordinate: JSON.stringify(coordinates),
                date
            }, 'date');

        return result;
    }

    static async checkOut(studentId: number, coordinates: Coordinates, time?: string | Knex.Raw, date?: string | Knex.Raw) {
        const studentCheckIn = await AttendanceModel.getCheckIn(studentId);
        const studentCheckOut = await AttendanceModel.getCheckOut(studentId);
        const todaySchedule = await SchoolDayScheduleModel.getToday();
        const now = DateTime.now().toFormat('HH:mm:ss');

        // Jika siswa belum absen datang
        if (!studentCheckIn) {
            return null;
        }

        // Jika siswa sudah absen pulang
        if (studentCheckOut) {
            return null;
        }

        // Jika tidak ada jadwal hari ini
        if (!todaySchedule || now < todaySchedule.checkout_start_time || now > todaySchedule.checkout_end_time) {
            return null;
        }

        const status =  studentCheckIn.check_in_time > todaySchedule.checkin_end_time 
                        ? AttendanceStatus.PRESENT_LATE 
                        : AttendanceStatus.PRESENT;

        time = time || knexDBHelpers.CURENT_TIME;
        date = date || knexDBHelpers.CURRENT_DATE;

        const result = await knexDB('attendances')
            .where({ student_id: studentId, date })
            .update({
                check_out_time: time,
                check_out_coordinate: JSON.stringify(coordinates),
                status
            }, 'date');

        return result;
    }

    static async getMonthlyReport(studentId: number, month: number, year: number) {
        const result =  await knexDB('attendances')
                        .select([
                            'id',
                            'check_in_time',
                            'status',
                            'date'
                        ])
                        .whereRaw(`
                            student_id = ?
                            AND EXTRACT(MONTH FROM date) = ?
                            AND EXTRACT(YEAR FROM date) = ?
                        `, [studentId, month, year]);

        return result;
    }

    static async getStudentByDate(studentId: number, date: string) {
        const result = await knexDB('attendances')
                        .where('student_id', studentId)
                        .andWhere('date', date)
                        .first();

        return result;
    }

    static async getRandomStudentCooordinates(studentId: number) {
        const student = await StudentModel.getStudentById(studentId);

        if (!student) {
            return [];
        }

        const result = await knexDB('attendances')
                            .join('students', 'students.id', '=', 'attendances.student_id')
                            .select([
                                'students.name',
                                'attendances.check_in_time',
                                'attendances.check_out_time',
                                'attendances.check_in_coordinate',
                                'attendances.check_out_coordinate'
                            ])
                            .where('students.grade_id', student.grade_id)
                            .andWhere('students.major_id', student.major_id)
                            .andWhere('date', knexDBHelpers.CURRENT_DATE)
                            // .orderByRaw('RANDOM()')
                            .limit(150);

        return result;
    }
}

export default AttendanceModel;