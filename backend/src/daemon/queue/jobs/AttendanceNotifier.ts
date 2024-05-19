import Queue from "bull";
import createJob from "../../../utils/createJob";
import sendTelegramMessage from "../../../utils/notifier/telegram";
import AttendanceModel from "../../../models/AttendanceModel";
import StudentModel from "../../../models/StudentModel";

export interface AttendanceNotifierData {
    attendanceId: number;
}

export interface AttendanceNotifierModel {
    notifyStudentAttendance: (attendanceId: number) => Promise<void>;
}

const processor: Queue.ProcessCallbackFunction<any> = async (
    job: Queue.Job<AttendanceNotifierData>,
    done: Queue.DoneCallback
) => {
    const { attendanceId } = job.data;

    console.log(job.data);

    const attendance = await AttendanceModel.getAttendanceById(attendanceId);
    let student;
    let message;

    if (!attendance) {
        console.log('Student not found');
        return null;
    }

    student = await StudentModel.getStudentById(attendance.student_id);

    if (!student) {
        console.log('Student not found');
        return null;
    }

    if (attendance.check_out_time) {
        message = `Siswa atas nama ${student.name} telah melakukan absen pulang pada pukul ${attendance.check_out_time}`
    } else if (attendance.check_in_time) {
        message = `Siswa atas nama ${student.name} telah melakukan absen datang pada pukul ${attendance.check_in_time}`
    } else {
        console.log('Situation not found');
        return null;
    }

    sendTelegramMessage(
        process.env.TELEGRAM_SYSTEM_NOTIFIER_CHAT_ID!,
        message
    );

    done();
}

export default createJob<AttendanceNotifierData, AttendanceNotifierModel>(
    'attendance-notifier',
    processor,
    (instance) => ({
        async notifyStudentAttendance(attendanceId: number) {
            await instance.add({
                attendanceId
            })
        }
    })
);