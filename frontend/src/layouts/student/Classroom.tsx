'use client';

import Skeleton from "@/components/Skeleton";
import { swrFetcher } from "@/utils/swrFetcher";
import Image from "next/image";
import useSWRImmutable from "swr/immutable";

interface StudentItemProps {
    rank: number;
    name: string;
    status: string;
}

function StudentItem({ rank, name, status }: StudentItemProps) {
    return (
        <div className="flex gap-2 hover:bg-slate-100 p-4">
            <div className="flex-auto flex items-center gap-2">
                <div className="shrink-0">
                    <Image src="/user.webp" alt="profile" width={40} height={40} className="w-[40px] h-[40px] rounded-full bg-slate-200" />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-sm">{name}</h3>
                    <div className="flex gap-2 text-slate-400 text-xs">
                        <span>21693</span>
                        <span>.</span>
                        <span>{status || '-'}</span>
                    </div>
                </div>
            </div>
            <div className="shrink-0">
                <div className="text-sm">#{rank}</div>
            </div>
        </div>
    );
}

function StudentItemSkeleton() {
    return (
        <>
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
            <Skeleton style={{ height: '60px', marginBlock: '0.5rem' }} />
        </>
    );
}

function Classroom() {
    const { data: classmates } = useSWRImmutable(
        '/api/v1/student/attendance/classroom',
        swrFetcher
    );
    
    return (
        <div className="flex flex-col gap-6 rounded-lg bg-white border">
            <h1 className="text-2xl font-semibold p-4">Ruang Kelas</h1>
            <hr />
            <div>
            {
                classmates
                    ? classmates.map((classmate: any, index: number) => {
                        return (
                            <StudentItem
                                key={classmate.id}
                                name={classmate.name} 
                                status={classmate.status}
                                rank={index+1} />
                        )
                    })
                    : <StudentItemSkeleton />
            }
            </div>
        </div>
    );
}

export default Classroom;