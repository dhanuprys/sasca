import SchoolDayScheduleModel from '../../../models/SchoolDayScheduleModel';
import LastAttendanceCheckingDateModel from '../../../models/LastAttendanceCheckingDateModel';
import AttendanceModel from '../../../models/AttendanceModel';
import StudentModel from '../../../models/StudentModel';
import { DateTime } from 'luxon';
import chalk from 'chalk';
import knexDB from '../../../utils/db';

async function autoAlpha() {
    const now = DateTime.now();
    const startSchoolDay = await SchoolDayScheduleModel.getFirstDay();
    const lastChecked = await LastAttendanceCheckingDateModel.getLastCheckDate();

    const rawStartCheckingDate = (() => {
        if (lastChecked) {
            return DateTime.fromFormat(lastChecked, 'yyyy-MM-dd')
                            .plus({ day: 1 })
                            .toFormat('yyyy-MM-dd');
        }

        return startSchoolDay.date || null;
    })();

    let startCheckingDate;
    let endCheckingDate = DateTime.now().startOf('day');
    const studentIds = await StudentModel.getAllStudentId();

    const checkDateRange = [];

    if (!rawStartCheckingDate) {
        console.log(chalk.red('Belum ada jadwal untuk memulai'));
        return null;
    }

    startCheckingDate = DateTime.fromFormat(rawStartCheckingDate, 'yyyy-MM-dd').startOf('day');

    // Jika melebihi dari hari ini
    if (startCheckingDate > endCheckingDate) {
        console.log(`Belum dapat memulai proses ${startCheckingDate.toFormat('yyyy-MM-dd')} > ${endCheckingDate.toFormat('yyyy-MM-dd')}`);
        return null;
    }

    // Mendapatkan rentangan tanggal yang harus diproses
    for (
        let currentDate = startCheckingDate;
        currentDate <= endCheckingDate;
        currentDate = currentDate.plus({ day: 1 })
    ) {
        checkDateRange.push(currentDate.toFormat('yyyy-MM-dd'));
    }

    console.log(`Checking from ${startCheckingDate.toFormat('yyyy-MM-dd')}-${endCheckingDate.toFormat('yyyy-MM-dd')}`);

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

        console.log(`Schedule for ${currentDate} successfully fetched!`);

        // Jika yang akan di cek adalah hari ini maka sistem harus
        // melihat jadwal terlebih dahulu
        if (
            currentDate === now.toFormat('yyyy-MM-dd')
            && now.toFormat('HH:mm:ss') < currentSchedule.checkout_end_time
        ) {
            console.log(`Belum dapat mengeksekusi sistem pada ${currentDate} karena jam masih kurang dari jadwal`);
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

            // Jika statusnya sudah di set
            if (studentStatus.status) {
                console.log(`Skipping [${currentDate}][${studentId}]`);
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

    // Mencatat tanggal pengecekan terakkhir
    await LastAttendanceCheckingDateModel.addLastDate(endCheckingDate.toFormat('yyyy-MM-dd'));

    return 0;
}

export default autoAlpha;