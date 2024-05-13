import { JWTUserPayload } from "../blueprint";
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
}

export default AccountModel;