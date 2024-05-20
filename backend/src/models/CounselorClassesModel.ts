import knexDB from "../utils/db";

class CounselorClassesModel {
    static async getStudents(classesId: number) {
        const result = await knexDB('counselor_classes')
                            .select([
                                'students.id',
                                'students.avatar_path',
                                'students.name',
                                'students.nisn',
                                'students.nis',
                                knexDB.raw("CONCAT(student_grades.long_name, ' ', student_majors.long_name, ' ', counselor_classes.group_num) AS class_name")
                            ])
                            .join('student_grades', 'student_grades.id', 'counselor_classes.grade_id')
                            .join('student_majors', 'student_majors.id', 'counselor_classes.major_id')
                            .join('students', function (join) {
                                join.on('students.grade_id', 'counselor_classes.grade_id');
                                join.on('students.major_id', 'counselor_classes.major_id');
                                join.on('students.group_num', 'counselor_classes.group_num');
                            })
                            .where('counselor_classes.id', classesId)
                            .orderBy('students.name');

        return result;
    }
}

export default CounselorClassesModel;