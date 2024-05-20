'use client';

import Skeleton from "@/components/Skeleton";
import StudentDetail from "@/components/counselor/StudentDetail";
import useBottomModalStore from "@/context/useBottomModal";
import { swrFetcher } from "@/utils/swrFetcher";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegCircle } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useSWRImmutable from "swr/immutable";

interface StudentItemProps {
    id: number;
    name: string;
    avatarPath?: string;
    nisn: string;
    nis: string;
}

function StudentItem({ id, name, avatarPath, nisn, nis }: StudentItemProps) {
    const router = useRouter();
    const { open: openModal } = useBottomModalStore();

    const openDetail = () => {
        router.push(`/counselor/student/${id}`);
    };

    return (
        <div onClick={openDetail} className="flex items-center gap-2 hover:bg-slate-100 p-4">
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
    const router = useRouter();

    const { data: classroom } = useSWRImmutable(
        `/api/v1/counselor/classroom/${classesId}`,
        swrFetcher
    );

    return (
        <div className="flex flex-col gap-4 min-h-screen md:rounded-xl bg-white border">
            <div className="p-4 flex items-center gap-2">
                <IoIosArrowBack onClick={() => router.back()} className="text-2xl box-content py-4 pr-2 hover:cursor-pointer" />

                <div>
                    <span className="text-xl font-semibold mr-2">Ruang Kelas</span>
                    <span className="text-xl font-semibold text-sky-800">{classroom && classroom.length >= 1 && <>{classroom[0].class_name}</>}</span>
                </div>
            </div>
            {/* <hr /> */}

            <div>
                {
                    classroom
                        ? classroom.map((classmate: any, index: number) => {
                            return (
                                <StudentItem
                                    key={classmate.id}
                                    id={classmate.id}
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