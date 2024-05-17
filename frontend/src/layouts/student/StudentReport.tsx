'use client'

import Calendar from "@/components/Calendar";
import AttendanceStatus from "@/constant/AttendanceStatus";
import now from "@/utils/now";
import axios from "axios";
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

function StudentReport() {
    const [date, setDate] = useState(now());
    const [attendances, setAttendances] = useState([]);
    const [holidays, setHolidays] = useState([]);

    const getCircleColor = useCallback((checkIn?: string, status?: string) => {
        let output = '';

        switch (status) {
            case AttendanceStatus.PRESENT:
                output = 'bg-green-800';
                break;
            case AttendanceStatus.PRESENT_LATE:
                output = 'bg-yellow-800';
                break;
            case AttendanceStatus.SICK:
            case AttendanceStatus.PERMISSION_ABSENT:
                output = 'bg-orange-800';
                break;
            case AttendanceStatus.NOT_CONFIRMED_ABSENT:
                output = 'bg-red-500';
                break;
        }

        if (checkIn && output === '') output = 'bg-slate-500';

        return output;
    }, []);

    const handleCell = useCallback(
        (fullDate: string, { days, position }: { days: number, position: 'prev' | 'current' | 'next' }) => {
            const attendance = getDateFromList(attendances, fullDate);
            const holiday = getDateFromList(holidays, fullDate);

            return (
                <div className="flex flex-col items-center relative font-semibold">
                    <span className={`text-sm md:text-base ${position === 'current' && holiday ? 'text-red-500' : position !== 'current' ? 'text-slate-400' : ''}`}>{days}</span>
                    <div className={`w-full h-[3px] rounded-full ${getCircleColor(attendance?.check_in_time, attendance?.status)}`}></div>
                </div>
            );
        }, 
        [attendances, holidays]
    );

    useEffect(() => {
        setAttendances([]);

        axios.get(`/api/v1/student/attendance?month=${date.month}&year=${date.year}`).then((response) => {
            if (response.status !== 200) return;

            setAttendances(response.data);
        }).catch(error => {

        });

        axios.get(`/api/v1/schedule/holiday?month=${date.month}&year=${date.year}`).then((response) => {
            if (response.status !== 200) return;

            setHolidays(response.data);
        }).catch(error => {

        })
    }, [date]);

    return (
        <div>
            <div className="fixed bottom-0 z-[1010]">HELLO BRO</div>
            <Calendar onDateChange={setDate} onCell={handleCell} />
        </div>
    );
}

export default StudentReport;