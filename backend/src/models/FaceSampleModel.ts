import knexDB from "../utils/db";

class FaceSampleModel {
    static async isSampleAvailable(studentId: number, sampleTreshold: number = 3): Promise<boolean> {
        const result = await knexDB('face_samples')
            .where({ student_id: studentId })
            .limit(sampleTreshold);

        return result.length >= sampleTreshold;
    }
}

export default FaceSampleModel;