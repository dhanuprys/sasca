require('dotenv').config({ path: ['.env.local', '.env'] });

import cron from 'node-cron';
import knexDB from '../../utils/db';
import SchoolDayScheduleModel from '../../models/SchoolDayScheduleModel';
import LastAttendanceCheckingDateModel from '../../models/LastAttendanceCheckingDateModel';
import AttendanceModel from '../../models/AttendanceModel';
import StudentModel from '../../models/StudentModel';
import { DateTime } from 'luxon';

console.log('Registering ranking cron every 07:00 PM');
cron.schedule('0 19 * * *', async () => {
    await knexDB.raw(`
        WITH rank_data AS (
            SELECT 
                student_id,
                (present * 2) +
                (present_late * 1) +
                (not_confirmed_absent * -1) +
                (permission_absent * 0) +  -- Neutral, no impact on points
                (sick * -1) +
                (check_in_only * 1) AS total_points,
                ROW_NUMBER() OVER (ORDER BY (present * 2) +
                                               (present_late * 1) +
                                               (not_confirmed_absent * -1) +
                                               (sick * -1) +
                                               (check_in_only * 1) DESC) AS rank
            FROM
                attendance_summary
        )
        INSERT INTO attendance_rank (student_id, total_points, rank, calculation_date, previous_rank, rank_change)
        SELECT 
            student_id,
            total_points,
            rank,
            NOW(),  -- or CURRENT_TIMESTAMP for current date and time
            LAG(rank) OVER (ORDER BY rank) AS previous_rank,
            rank - LAG(rank) OVER (ORDER BY rank) AS rank_change
        FROM 
            rank_data;
    `);
});

async function autoAlpha() {
    const startSchoolDay = await SchoolDayScheduleModel.getFirstDay();
    const lastChecked = await LastAttendanceCheckingDateModel.getLastCheckDate();

    const rawStartCheckingDate = (() => {
        if (lastChecked) {
            return DateTime.fromFormat(lastChecked, 'yyyy-MM-dd')
                            .plus({ day: 1 })
                            .toFormat('yyyy-MM-dd');
        }

        return startSchoolDay || null;
    })();

    let startCheckingDate;
    let endCheckingDate = DateTime.now();
    const studentIds = await StudentModel.getAllStudentId();

    const checkDateRange = [];

    if (!rawStartCheckingDate) {
        console.log('Belum ada jadwal untuk memulai');
        return;
    }

    startCheckingDate = DateTime.fromFormat(rawStartCheckingDate, 'yyyy-MM-dd');

    // Jika melebihi dari hari ini
    if (startCheckingDate > endCheckingDate) {
        console.log(`Belum dapat memulai proses ${startCheckingDate.toFormat('yyyy-MM-dd')} > ${endCheckingDate.toFormat('yyyy-MM-dd')}`);
        return;
    }

    // Mendapatkan rentangan tanggal yang harus diproses
    for (
        let currentDate = startCheckingDate;
        currentDate <= endCheckingDate;
        currentDate = currentDate.plus({ day: 1 })
    ) {
        checkDateRange.push(currentDate.toFormat('yyyy-MM-dd'));
    }

    // Memproses kehadiran berdasarkan daftar tanggal yang 
    // sudah disiapkan
    for (const currentDate of checkDateRange) {
        const currentSchedule = await SchoolDayScheduleModel.getByDate(currentDate);

        // Melompati proses jika tidak ada jadwal ditemukan pada
        // tanggal yang dicari atau ketika tanggal tersebut adalah libur
        if (!currentSchedule || currentSchedule.is_holiday) {
            console.log(`Schedule not found [${currentDate}]`);
            continue;
        }

        for (const studentId of studentIds) {
            const studentStatus = await AttendanceModel.getStudentByDate(studentId, currentDate);

            // Jika sama sekali tidak ada tanda-tanda absensi
            if (!studentStatus) {
                console.log(`Student alpha [${currentDate}][${studentId}]`);
                await AttendanceModel.giveAlphaStatus(studentId, currentDate);
                continue;
            }

            // Jika ada data namun tidak memiliki status 
            if (studentStatus && studentStatus.check_in_time && !studentStatus.check_out_time) {
                console.log(`Check in only [${currentDate}][${studentId}]`);
                await AttendanceModel.giveCheckInOnlyStatus(studentStatus.id);
                continue;
            }
        }
    }

    LastAttendanceCheckingDateModel.addLastDate(endCheckingDate.toFormat('yyyy-MM-dd'));
}

// AUTO ALPHA
// Jam untuk schedule ini harus dijalankan setelah absensi ditutup
console.log('Registering auto-alpha cron every 08:00 PM');
cron.schedule('0 20 * * *', async () => {
    await autoAlpha();
});