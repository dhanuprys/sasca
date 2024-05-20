import { FaArrowDown } from "react-icons/fa";
import HolidayStatus from "../students/attendance/HolidayStatus";

interface Schedule {
    checkin_start_time: string;
    checkin_end_time: string;
    checkout_start_time: string;
    checkout_end_time: string;
    is_holiday: boolean;
    holiday_reason: string;
}

interface ScheduleDetailProps {
    schedule: Schedule;
}

function ScheduleDetail({ schedule }: ScheduleDetailProps) {
    const { checkin_start_time, checkin_end_time, checkout_start_time, checkout_end_time } = schedule;

    return (
        <div>
            {
                schedule.is_holiday
                    ? <HolidayStatus borderless={true} reason={schedule.holiday_reason} />
                    : <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-100 rounded-xl px-4 py-2 flex flex-col gap-1 items-center justify-center">
                            <span className="font-semibold">Datang</span>
                            <span className="text-sky-800 font-semibold">{checkin_start_time}</span>
                            <FaArrowDown className="text-blue-700" />
                            <span className="text-sky-800 font-semibold">{checkin_end_time}</span>
                        </div>
                        <div className="bg-slate-100 rounded-xl px-4 py-2 flex flex-col gap-1 items-center justify-center">
                            <span className="font-semibold">Pulang</span>
                            <span className="text-sky-800 font-semibold">{checkout_start_time}</span>
                            <FaArrowDown className="text-blue-700" />
                            <span className="text-sky-800 font-semibold">{checkout_end_time}</span>
                        </div>
                    </div>
            }
        </div>
    );
}

export default ScheduleDetail;