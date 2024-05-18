'use client';

import { LuCircleSlash2 } from "react-icons/lu";

interface AttendanceNotFoundProps {
    borderless?: boolean;
}

function AttendanceNotFound({ borderless }: AttendanceNotFoundProps ) {
    return (
        <div className={`flex flex-col items-center gap-4 ${borderless ? '' : 'border'} rounded-lg px-4 py-8 md:p-8 bg-white`}>
            <div className="flex justify-center">
                <LuCircleSlash2 className="text-8xl text-slate-600" />
            </div>
            <h1 className="text-lg font-semibold text-center">Belum Absensi</h1>
            <p className="text-center text-xs md:text-sm text-slate-400">Anda belum melakukan absensi pada hari ini.</p>
            {/* <div>
                <Link href="/student/face-registration" className="focus:ring-2 focus:ring-yellow-500 bg-yellow-200 text-yellow-700 font-semibold px-4 py-2 rounded-lg">
                    Rekam Wajah
                </Link>
            </div> */}
        </div>
    );
}

export default AttendanceNotFound;