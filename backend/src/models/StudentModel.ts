import knexDB, { knexDBHelpers } from "../utils/db";

class StudentModel {
    static async getStudentById(studentId: number) {
        const student = await knexDB('students')
            .select([
                'students.id',
                'students.avatar_path',
                'students.name',
                'students.nisn',
                'students.nis',
                'students.gender',
                'students.grade_id',
                'students.major_id',
                'students.group_num',
                knexDB.raw("CONCAT(student_grades.long_name, ' ', student_majors.long_Name, ' ', students.group_num) AS class_name")
            ])
            .join('student_grades', 'student_grades.id', 'students.grade_id')
            .join('student_majors', 'student_majors.id', 'students.major_id')
            .where('students.id', studentId)
            .first();

        return student;
    }

    static async setPhotoProfile(studentId: number, photoPath: string) {
        const result = await knexDB('students')
            .where('id', studentId)
            .update({
                avatar_path: photoPath
            });

        return result;
    }

    static async getAllStudentId() {
        const students = await knexDB('students')
            .select('id');

        return students.map((student) => student.id);
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
                'students.avatar_path',
                'students.name',
                'check_in_time',
                'attendances.status'
            ])
            .leftJoin('attendances', function () {
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

    static async getStudentCounselor(studentId: number) {
        const student = await StudentModel.getStudentById(studentId);

        if (!student || !student.grade_id || !student.major_id) {
            return null;
        }

        const result = await knexDB('counselor_classes')
            .select([
                'counselors.id',
                'counselors.name',
                'counselors.nip',
                'counselors.contact'
            ])
            .join('students', function (join) {
                join.on('students.grade_id', 'counselor_classes.grade_id');
                join.on('students.major_id', 'counselor_classes.major_id');
                join.on('students.group_num', 'counselor_classes.group_num');
            })
            .join('counselors', 'counselors.id', '=', 'counselor_classes.counselor_id')
            .where('students.id', studentId)
            .first();

        return result;
    }
}

export default StudentModel;