require('dotenv').config({ path: ['.env.local', '.env'] });

const knexDB = require('../dist/utils/db').default;
const Hash = require('../dist/services/Hash').default;

async function start() {
    const students = await knexDB('students');

    let count = 0;

    for await (const student of students) {
        console.log(count);

        const checking = await knexDB('accounts')
            .where('role', 'student')
            .andWhere('entity_id', student.id)
            .first();

        count++;

        if (checking) {
            console.log(`Skipping username: ${checking.username}`);
            continue;
        }

        console.log(`Create user: ${student.nis}`);

        await knexDB('accounts')
            .insert({
                role: 'student',
                entity_id: student.id,
                username: student.nis,
                password: await Hash.hash(student.nisn)
            });
    }

    console.log('Proses selesai');
}

start();