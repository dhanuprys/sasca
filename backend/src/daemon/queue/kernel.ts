import { QueueJobItem } from "../../blueprint";
import AttendanceNotifier from "./jobs/AttendanceNotifier";
import SystemNotifier from "./jobs/SystemNotifier";

const jobs: QueueJobItem[] = [
    {
        name: 'System Notifier',
        description: 'Notify system from background',
        queue: SystemNotifier
    },
    {
        name: 'Student Attendance Notifier',
        description: 'Notify when student do attendance',
        queue: AttendanceNotifier
    }
];

export default jobs;