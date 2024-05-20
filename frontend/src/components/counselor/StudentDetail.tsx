'use client';

import useSWRImmutable from "swr/immutable";
import { swrFetcher } from "@/utils/swrFetcher";

interface StudentDetailProps {
    studentId: number;
}

function StudentDetail({ studentId }: StudentDetailProps) {
    const { data: student, error: studentError } = useSWRImmutable(
        `/api/v1/counselor/student/${studentId}`,
        swrFetcher
    );

    if (studentError) {
        if (studentError.response.status === 404) {
            return 'Siswa tidak ditemukan';
        }

        return 'Server error';
    }

    if (!student) {
        return 'loading...'
    }

    return (
        <div className="bg-white p-4 rounded-xl border">
            <div className="flex flex-col justify-center items-center gap-2">
                <img src={student.avatar_path ? `/api/_static/${student.avatar_path}` : '/user.webp'} className="w-[120px] h-[120px] bg-slate-100 rounded-full" />
                <h3 className="font-semibold text-xl text-center">{student.name}</h3>
                <span>{student.class_name}</span>
            </div>
        </div>
    );
}

export default StudentDetail;