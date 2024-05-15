import knexDB from "../utils/db";

class FaceSampleModel {
    static async isSampleAvailable(studentId: number, sampleTreshold: number = 3): Promise<boolean> {
        const result = await knexDB('face_samples')
            .where({ student_id: studentId })
            .limit(sampleTreshold)
            .count();

        return result && result[0].count as number >= sampleTreshold;
    }

    static async getStudentSamples(studentId: number, limit: number = 3) {
        const result = await knexDB('face_samples')
            .where({ student_id: studentId })
            .limit(limit);

        return result;
    }
}

export default FaceSampleModel;