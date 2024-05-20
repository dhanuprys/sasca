'use client';

import Skeleton from "@/components/Skeleton";
import { swrFetcher } from "@/utils/swrFetcher";
import Image from "next/image";
import { FaRegCircle } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import useSWRImmutable from "swr/immutable";

interface StudentItemProps {
    name: string;
    avatarPath?: string;
    nisn: string;
    nis: string;
}

function StudentItem({ name, avatarPath, nisn, nis }: StudentItemProps) {
    return (
        <div className="flex items-center gap-2 hover:bg-slate-100 p-4">
            <div className="flex-auto flex items-center gap-2">
                <div className="shrink-0">
                    <img src={avatarPath ? `/api/_static/${avatarPath}` : '/user.webp'} alt="profile" className="w-[40px] h-[40px] rounded-full bg-slate-200" />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-sm">{name}</h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <span>{nisn}</span>
                        
                        <span>{nis}</span>
                    </div>
                </div>
            </div>
            <div className="shrink-0">
                <IoIosArrowForward />
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

interface ClassroomProps {
    classesId: number;
}

function Classroom({ classesId }: ClassroomProps) {
    const { data: classroom } = useSWRImmutable(
        `/api/v1/counselor/classroom/${classesId}`,
        swrFetcher
    );

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white border">
            <h1 className="text-2xl font-semibold p-4">Ruang Kelas</h1>
            {/* <hr /> */}
            
            <div>
                {
                    classroom
                        ? classroom.map((classmate: any, index: number) => {
                            return (
                                <StudentItem
                                    key={classmate.id}
                                    name={classmate.name}
                                    nisn={classmate.nisn}
                                    nis={classmate.nis}
                                    avatarPath={classmate.avatar_path} />
                            )
                        })
                        : <StudentItemSkeleton />
                }
            </div>
        </div>
    );
}

export default Classroom;