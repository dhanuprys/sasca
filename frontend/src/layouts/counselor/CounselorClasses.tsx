'use client';

import Skeleton from "@/components/Skeleton";
import { swrFetcher } from "@/utils/swrFetcher";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import useSWRImmutable from "swr/immutable";

interface ClassItemProps {
    classesId: number;
    className: string;
}

function ClassItem({ classesId, className }: ClassItemProps) {
    return (
        <Link href={`/counselor/classroom/${classesId}`} className="hover:bg-slate-100 px-4 py-2 hover:cursor-pointer flex justify-between items-center">
            <div>
                <h2 className="font-semibold text-blue-700">{className}</h2>
                <div className="text-slate-400 text-sm">
                    Siswa (98)
                </div>
            </div>
            <IoIosArrowForward />
        </Link>
    );
}

function CounselorClasses() {
    const { data: classroom, error: classesError, isLoading: classesLoading } = useSWRImmutable(
        '/api/v1/counselor/classroom',
        swrFetcher
    );

    if (classesLoading) {
        return <Skeleton style={{ height: '400px' }} />;
    }

    return (
        <div className="rounded-xl border py-4 bg-white">
            <h1 className="mb-4 font-semibold text-2xl px-4">Kelas</h1>
            <div>
                {
                    classroom && classroom.map((classes: any) => {
                        return (
                            <ClassItem key={classes.id} classesId={classes.id} className={classes.class_name} />
                        );
                    })
                }
            </div>
        </div>
    );
}

export default CounselorClasses;