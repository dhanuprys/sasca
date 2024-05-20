import { where } from "@tensorflow/tfjs-node";
import knexDB from "../utils/db";
import StudentModel from "./StudentModel";

class CounselorClassesModel {
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

export default CounselorClassesModel;