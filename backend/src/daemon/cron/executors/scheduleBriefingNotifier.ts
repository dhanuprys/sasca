import SchoolDayScheduleModel from "../../../models/SchoolDayScheduleModel";
import pushNotification from "../../../utils/pushNotification";

async function scheduleBriefingNotifier() {
    const today = await SchoolDayScheduleModel.getToday();

    if (!today) return;

    if (today.is_holiday) {
        await pushNotification(
            {
                type: 'all-student'
            },
            {
                title: '[SASCA] Informasi Jadwal',
                body: 'Hari ini libur'
            }
        )

        return;
    }

    await pushNotification(
        {
            type: 'all-student'
        },
        {
            title: '[SASCA] Informasi Jadwal',
            body: `Selamat Pagi! Jadwal absensi masuk hari ini adalah ${today.checkin_start_time}-${today.checkin_end_time} dan jam pulang pada ${today.checkout_start_time}-${today.checkout_end_time}`
        }
    )
}

export default scheduleBriefingNotifier;