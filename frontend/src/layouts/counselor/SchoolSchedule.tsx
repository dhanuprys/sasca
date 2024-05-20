'use client'

import Calendar from "@/components/Calendar";
import ScheduleDetail from "@/components/counselor/schedule/SchedulePopup";
// import AttendanceDetail from "@/components/students/attendance/AttendanceDetails";
// import AttendanceStatus from "@/constant/AttendanceStatus";
import useBottomModalStore from "@/context/useBottomModal";
import now from "@/utils/now";
import axios from "axios";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";

interface ListWithDate {
    date: string;
}

function getDateFromList(attendances: ListWithDate[], findDate: string): any {
    for (const attendance of attendances) {
        if (attendance.date !== findDate) continue;

        return attendance;
    }

    return null;
}

function SchoolSchedule() {
    const [date, setDate] = useState(now());
    const [holidays, setHolidays] = useState([]);

    const { open: openModal } = useBottomModalStore();

    const handleCell = useCallback(
        (fullDate: string, { days, position }: { days: number, position: 'prev' | 'current' | 'next' }) => {
            const holiday = getDateFromList(holidays, fullDate);

            return (
                <div className="flex flex-col items-center relative font-semibold">
                    <span className={`text-sm md:text-base ${position === 'current' && holiday ? 'text-red-500' : position !== 'current' ? 'text-slate-400' : ''}`}>{days}</span>
                    <div className={`w-full h-[3px] rounded-full`}></div>
                </div>
            );
        }, 
        [holidays]
    );

    const handleCellClick = (fullDate: string) => {
        openModal(
            <ScheduleDetail date={fullDate} />,
            DateTime.fromFormat(fullDate, 'yyyy-MM-dd')
                    .setLocale('id')
                    .toFormat('cccc, dd LLLL yyyy')
        );
    };

    useEffect(() => {
        axios.get(`/api/v1/schedule/holiday?month=${date.month}&year=${date.year}`).then((response) => {
            if (response.status !== 200) return;

            setHolidays(response.data);
        }).catch(error => {

        })
    }, [date]);

    return (
        <div>
            <Calendar onDateChange={setDate} onCellClick={handleCellClick} onCell={handleCell} />
        </div>
    );
}

export default SchoolSchedule;