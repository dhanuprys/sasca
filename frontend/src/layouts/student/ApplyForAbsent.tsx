'use client';

import Skeleton from "@/components/Skeleton";
import { swrFetcher } from "@/utils/swrFetcher";
import { ReactNode } from "react";
import { HiOutlineDocument } from "react-icons/hi2";
import { MdOutlineSick } from "react-icons/md";
import useSWRImmutable from "swr/immutable";

interface AbsentItemProps {
    icon: ReactNode;
    label: string;
}

function AbsentItem({ icon, label }: AbsentItemProps) {
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <div className="[&>*]:text-sky-800 [&>*]:text-xl">
                {icon}
            </div>
            <span className="text-xs md:text-sm text-slate-500">{label}</span>
        </div>
    );
}

function ApplyForAbsent() {
    const { data: todaySchedule, error: scheduleError, isLoading: scheduleLoading } = useSWRImmutable<any>(
        '/api/v1/schedule/today',
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );

    const { data: checkStatus } = useSWRImmutable<any>(
        '/api/v1/student/attendance/check',
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );

    if (scheduleLoading) {
        return <Skeleton style={{ height: '100px' }} />
    }

    if (
        !todaySchedule 
        || todaySchedule.holiday_reason 
        || (checkStatus && (checkStatus.check_in_time || checkStatus.status))
    ) {
        return null;
    }
    
    return (
        <div className="bg-white border p-4 rounded-lg">
            <h2 className="text-sm font-semibold">Ajukan absen tidak hadir</h2>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <AbsentItem icon={<MdOutlineSick />} label="Sakit" />
                <AbsentItem icon={<HiOutlineDocument />} label="Izin" />
            </div>
        </div>
    );
}

export default ApplyForAbsent;