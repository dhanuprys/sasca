import knexDB, { knexDBHelpers } from "../utils/db";

class StudentModel {
    static async getStudentById(studentId: number) {
        const student = await knexDB('students')
                        .where({
                            id: studentId
                        }).first();

        return student;
    }

    static async getStudentClassroomWithTodaysAttendance(studentId: number) {
        const student = await StudentModel.getStudentById(studentId);
        
        if (!student) {
            return null;
        }

        const classroom = await StudentModel.getClassroomTodaysAttendance(
            student.grade_id,
            student.major_id,
            student.group_num
        );

        return classroom;
    }

    static async getClassroomTodaysAttendance(gradeId: string, majorId: string, groupNum: number) {
        const result = await knexDB('students')
                        .select([
                            'students.id',
                            'students.name',
                            'check_in_time',
                            'attendances.status'
                        ])
                        .leftJoin('attendances', function() {
                            this.on('students.id', 'attendances.student_id')
                                .andOn('attendances.date', knexDBHelpers.CURRENT_DATE);
                        })
                        .where({
                            grade_id: gradeId,
                            major_id: majorId,
                            group_num: groupNum
                        })
                        .orderBy('attendances.check_in_time')
                        .orderBy('students.name');

        return result;
    }

    static async getClassroom(gradeId: string, majorId: string, groupNum: number) {
        const result = await knexDB('students')
                        .where({
                            grade_id: gradeId,
                            major_id: majorId,
                            group_num: groupNum
                        });

        return result;
    }
}

export default StudentModel;