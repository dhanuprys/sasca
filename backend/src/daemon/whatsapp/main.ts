require('dotenv').config({ path: ['.env.local', '.env'] });
const SERVICE_MODE: string | undefined = process.env.SERVICE_MODE

if (
    SERVICE_MODE !== 'ALL'
    && SERVICE_MODE !== 'WA'
) {
    console.error('Whatsapp inactive');
    while (true) { /* SUSPEND PROCESS */ }
}

import { create, Client, decryptMedia, ev } from '@open-wa/wa-automate';
import AttendanceModel from '../../models/AttendanceModel';
import { DateTime } from 'luxon';
import StudentModel from '../../models/StudentModel';

create({
    sessionDataPath: 'sessions',
    useChrome: true,
    executablePath: '/usr/bin/google-chrome',
    sessionId: 'sasca',
    multiDevice: true,
    qrTimeout: 0
}).then((client) => {
    start(client)
});

function start(client: Client) {
    client.onMessage(async message => {
        const today = DateTime.now().toFormat('yyyy-MM-dd');
        const nisnInput = message.body;

        if (!/^[\d]{10}$/.test(nisnInput) || /@g\.us$/.test(message.from)) {
            return;
        }

        const studentInfo = await StudentModel.getStudentByNisn(nisnInput);

        if (!studentInfo) {
            await client.sendText(message.from, 'Maaf, data siswa tidak ditemukan.');
            return;
        }

        const todayAttendance = await AttendanceModel.getFullCheckPoint(studentInfo.id, today);


        if (!todayAttendance) {
            const output = `
Nama siswa: ${studentInfo.name}
NISN: ${studentInfo.nisn}

Siswa belum melakukan absen datang atau pun absen pulang
        `;

            await client.sendText(message.from, output);
            return
        }

        const output = `
Nama siswa: ${studentInfo.name}
NISN: ${studentInfo.nisn}

Absen datang: ${todayAttendance.check_in_time || 'Belum absen datang'}
Absen pulang: ${todayAttendance.check_out_time || 'Belum absen pulang'}
        `;

        await client.sendText(message.from, output);
    })
}