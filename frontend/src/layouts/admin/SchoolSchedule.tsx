'use client'

import Calendar from "@/components/Calendar";
import ScheduleCreation from "@/components/admin/schedule/ScheduleCreation";
import ScheduleDetail from "@/components/admin/schedule/SchedulePopup";
import FlexColumn from "@/components/miscellaneous/FlexColumn";
// import AttendanceDetail from "@/components/students/attendance/AttendanceDetails";
// import AttendanceStatus from "@/constant/AttendanceStatus";
import useBottomModalStore from "@/context/useBottomModal";
import useDateSelection from "@/context/useDateSelection";
import now from "@/utils/now";
import axios from "axios";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { mutate } from "swr";

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
    const [schooldays, setSchooldays] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const { dates: selectedDates, add: addDate, delete: deleteDate, clear: clearDates } = useDateSelection();

    const { open: openModal } = useBottomModalStore();

    const handleCell = useCallback(
        (fullDate: string, { days, position }: { days: number, position: 'prev' | 'current' | 'next' }) => {
            const holiday = getDateFromList(holidays, fullDate);
            const schoolday = getDateFromList(schooldays, fullDate);

            return (
                <div className="flex flex-col items-center relative font-semibold">
                    <span className={selectedDates.has(fullDate) ? 'bg-yellow-500' : `text-sm md:text-base ${holiday ? 'text-red-500' : schoolday ? 'text-blue-500' : position !== 'current' ? 'text-slate-400' : ''}`}>{days}</span>
                    <div className={`w-full h-[3px] rounded-full`}></div>
                </div>
            );
        },
        [holidays, schooldays, selectedDates]
    );

    const handleCellClick = (fullDate: string) => {
        if (selectionMode) {
            if (selectedDates.has(fullDate)) {
                deleteDate(fullDate);
            } else {
                addDate(fullDate);
            }
            return;
        }

        openModal(
            <ScheduleDetail date={fullDate} />,
            DateTime.fromFormat(fullDate, 'yyyy-MM-dd')
                .setLocale('id')
                .toFormat('cccc, dd LLLL yyyy')
        );
    };

    const storeSchedule = () => {
        if (selectedDates.size <= 0) return;

        openModal(
            <ScheduleCreation dates={Array.from(selectedDates)} />,
            'Simpan Jadwal'
        )
    };

    useEffect(() => {
        axios.get(`/api/v1/schedule/holiday?month=${date.month}&year=${date.year}`).then((response) => {
            if (response.status !== 200) return;

            setHolidays(response.data);
        }).catch(error => {

        })

        axios.get(`/api/v1/schedule/schooldays?month=${date.month}&year=${date.year}`).then((response) => {
            if (response.status !== 200) return;

            setSchooldays(response.data);
        }).catch(error => {

        })
    }, [date]);

    return (
        <FlexColumn>
            <div className="p-4 bg=white rounded-xl bg-white border">
                {
                    selectionMode
                        ? <div className="flex gap-2">
                            <button className="px-4 py-2 border rounded-xl" onClick={() => { clearDates(); setSelectionMode(false) }}>Batal</button>
                            <button className="px-4 py-2 border rounded-xl text-white bg-red-500" onClick={storeSchedule}>Simpan</button>
                        </div>
                        : <button onClick={() => setSelectionMode(true)} className="px-4 py-2 bg-sky-800 text-white rounded-xl">Pilih banyak</button>
                }
            </div>
            <Calendar onDateChange={setDate} onCellClick={handleCellClick} onCell={handleCell} />
        </FlexColumn>
    );
}

export default SchoolSchedule;