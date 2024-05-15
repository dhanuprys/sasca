import { JWTUserPayload } from "../blueprint";
import Roles from "../constant/Roles";
import knexDB from "../utils/db";

class AccountModel {
    static async authenticate(username: string, password: string): Promise<JWTUserPayload | null> {
        const user = await knexDB('accounts')
            .where({ username })
            .first();

        if (!user || password !== user.password) {
            return null;
        }

        return {
            id: user.id,
            entity_id: user.entity_id,
            username: user.username,
            role: user.role
        };
    }

    static async changePassword(accountId: number, oldPassword: string, newPassword: string) {
        const user = await knexDB('accounts')
            .where({ id: accountId })
            .first();

        if (!user || oldPassword !== user.password) {
            return null;
        }

        // Updating
        await knexDB('accounts')
            .where({ id: accountId })
            .update({
                password: newPassword
            });

        return {
            id: user.id
        };
    }

    static async getUserByEntityId(entityId: number, role: Roles, selectAll: boolean = false) {
        let result: Promise<any> | {} = {};

        switch (role) {
            case Roles.COUNSELOR:
                result = knexDB('counselors')
                            .where({ id: entityId })
                            .first();
            break;
            case Roles.STUDENT:
                result = knexDB('students')
                            .leftJoin('student_grades', 'student_grades.id', '=', 'students.grade_id')
                            .leftJoin('student_majors', 'student_majors.id', '=', 'students.major_id')
                            .select(
                                selectAll
                                    ? '*'
                                    : [
                                        'students.id',
                                        'avatar_path',
                                        'nisn',
                                        'nis',
                                        'name',
                                        knexDB.raw("CONCAT(student_grades.long_name, ' ', student_majors.long_name, ' ', students.group_num) AS class_name")
                                    ]
                            )
                            .where('students.id', entityId)
                            .first();
            break;
        }

        return await result;
    }
}

export default AccountModel;