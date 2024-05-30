import bcrypt from 'bcrypt';

class Hash {
    static async hash(plainText: string): Promise<string> {
        return await bcrypt.hash(plainText, 10);
    }

    static async verify(plainText: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plainText, hashed);
    }
}

export default Hash;