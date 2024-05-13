import Link from "next/link";
import { TbCalendarOff, TbUserScan } from "react-icons/tb";

function ScheduleNotFound() {
    return (
        <div className="flex flex-col items-center gap-4 border rounded-lg px-4 py-8 md:p-8 bg-white">
            <div className="flex justify-center">
                <TbCalendarOff className="text-8xl text-yellow-600" />
            </div>
            <h1 className="text-lg font-semibold text-center">Jadwal tidak ditemukan!</h1>
            <p className="text-center text-xs md:text-sm text-slate-400">Sepertinya adiministrator belum memasukkan jadwal untuk hari ini. Harap untuk segera menghubungi administrator atau pihak terkait</p>
            {/* <div>
                <Link href="/student/face-registration" className="focus:ring-2 focus:ring-yellow-500 bg-yellow-200 text-yellow-700 font-semibold px-4 py-2 rounded-lg">
                    Rekam Wajah
                </Link>
            </div> */}
        </div>
    );
}

export default ScheduleNotFound;