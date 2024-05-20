import knexDB from "../utils/db";

class CounselorModel {
    static async getCounselorClasses(counselorId: number) {
        const result = await knexDB('counselor_classes')
                            .select([
                                'counselor_classes.id',
                                knexDB.raw("CONCAT(student_grades.long_name, ' ', student_majors.long_name, ' ', counselor_classes.group_num) AS class_name")
                            ])
                            .join('student_grades', 'student_grades.id', 'counselor_classes.grade_id')
                            .join('student_majors', 'student_majors.id', 'counselor_classes.major_id')
                            .where('counselor_id', counselorId);

        return result;
    }
}

export default CounselorModel;