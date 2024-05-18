import knexDB from "../utils/db";

class AttendanceRank {
    static async getRanks(limit: number) {
        const result = await knexDB('attendance_rank')
                            .leftJoin('students', 'students.id', '=', 'attendance_rank.student_id')
                            .select([
                                'students.name',
                                'rank',
                                'total_points',
                                'previous_rank',
                                'rank_change',
                                'calculation_date'
                            ])
                            .orderBy('rank')
                            .limit(limit);

        return result;
    }
}

export default AttendanceRank;