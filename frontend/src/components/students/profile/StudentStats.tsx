'use client';

import Skeleton from "@/components/Skeleton";
import { swrFetcher } from "@/utils/swrFetcher";
import useSWRImmutable from "swr/immutable";

interface StatItemProps {
    label: string;
    count: number;
}

function StatItem({ label, count }: StatItemProps) {
    return (
        <div className="flex flex-col justify-center items-center">
            <h4 className="text-sky-800 font-bold">{count}</h4>
            <span className="text-xs text-slate-400">{label}</span>
        </div>
    );
}

function StudentStats() {
    const { data: stats } = useSWRImmutable(
        '/api/v1/student/attendance/summary',
        swrFetcher
    );

    if (!stats) {
        return <Skeleton style={{ height: '100px' }} />
    }

    return (
        <div className="grid grid-cols-4 p-4 bg-white border rounded-xl">
            <StatItem label="Hadir" count={Number(stats.present) + Number(stats.present_late)} />
            <StatItem label="Izin" count={stats.permission_absent} />
            <StatItem label="Sakit" count={stats.sick} />
            <StatItem label="Alpha" count={stats.not_confirmed_absent} />
        </div>
    );
}

export default StudentStats;