'use client';

import AttendanceStatus from "@/constant/AttendanceStatus";
import axios from "axios";
import { useRef, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";

interface AttendanceEditProps {
    date: string;
    studentId: number;
    onSuccess?: () => void;
}

function AttendanceEdit({ date, studentId, onSuccess }: AttendanceEditProps) {
    const [message, setMessage] = useState('');
    const reasonSelect = useRef<HTMLSelectElement>(null);

    const storeAttendance = () => {
        if (!reasonSelect.current) return;

        setMessage('');

        const selectOptions = reasonSelect.current.options;
        const selectedIndex = reasonSelect.current.selectedIndex;

        axios.put(`/api/v1/counselor/student/${studentId}/attendance`, {
            date,
            status: selectOptions[selectedIndex].value
        }).then(() => {
            onSuccess && onSuccess();
        }).catch(() => {
            setMessage('Gagal menyimpan');
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <span>{message}</span>
            <div>
                <select ref={reasonSelect} className="w-full px-6 py-8 rounded-xl border">
                    <option value={AttendanceStatus.PRESENT}>Hadir</option>
                    <option value={AttendanceStatus.PERMISSION_ABSENT}>Izin</option>
                    <option value={AttendanceStatus.SICK}>Sakit</option>
                    <option value={AttendanceStatus.NOT_CONFIRMED_ABSENT}>Alpha</option>
                </select>
            </div>
            <div className="mt-5">
                <button onClick={storeAttendance} className="bg-red-800 px-4 py-2 w-full rounded-xl text-white flex justify-center items-center gap-2">
                    <IoSaveOutline />
                    <span>SIMPAN</span>
                </button>
            </div>
        </div>
    );
}

export default AttendanceEdit;