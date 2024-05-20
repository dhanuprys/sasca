require('dotenv').config({ path: ['.env.local', '.env'] });

const knexDB = require('../dist/utils/db').default;

async function start() {
    const counselors = await knexDB('counselors');

    let count = 0;

    for await (const counselor of counselors) {
        console.log(count);

        const checking = await knexDB('accounts')
            .where('role', 'counselor')
            .andWhere('entity_id', counselor.id)
            .first();

        count++;

        if (checking) {
            console.log(`Skipping username: ${checking.username}`);
            continue;
        }

        console.log(`Create user: ${counselor.name}`);

        await knexDB('accounts')
            .insert({
                role: 'counselor',
                entity_id: counselor.id,
                username: counselor.nip,
                password: counselor.nip
            });
    }

    console.log('Proses selesai');
}

start();