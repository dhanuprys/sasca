import AttendanceStatus from "../constant/AttendanceStatus";
import knexDB from "../utils/db";

class AttendanceSummaryModel {
    static async getAllStatuses(studentId: number) {
        const result = await knexDB('attendance_summary')
                        .where({ student_id: studentId })
                        .first();

        return result;
    }
}

export default AttendanceSummaryModel;