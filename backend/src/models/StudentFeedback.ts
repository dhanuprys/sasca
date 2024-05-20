import knexDB from "../utils/db";

class StudentFeedback {
    static async getToday(studentId: number) {
        const result = await knexDB('student_feedbacks')
                            .where('student_id', studentId)
                            .andWhereRaw('DATE(datetime) = CURRENT_DATE')
                            .first();

        return result;
    }

    static async createFeedback(studentId: number, stars: number, message: string, coordinate?: [number, number]) {
        const result = await knexDB('student_feedbacks')
                            .insert({
                                student_id: studentId,
                                stars,
                                message,
                                coordinate: coordinate ? JSON.stringify(coordinate) : null
                            });

        return result;
    }
}

export default StudentFeedback;