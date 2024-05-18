require('dotenv').config({ path: ['.env.local', '.env'] });

import cron from 'node-cron';
import autoAlpha from './executor/autoAlpha';
import makeRank from './executor/makeRank';

console.log('Registering ranking cron every 07:00 PM');
cron.schedule('0 19 * * *', async () => {
    await makeRank();
}, {
    timezone: 'Asia/Makassar'
});

// AUTO ALPHA
// Jam untuk schedule ini harus dijalankan setelah absensi ditutup
console.log('Registering auto-alpha cron every 08:00 PM');
cron.schedule('0 20 * * *', async () => {
    await autoAlpha();
}, {
    timezone: 'Asia/Makassar'
});