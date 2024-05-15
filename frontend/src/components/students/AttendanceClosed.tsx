import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxLockClosed } from "react-icons/rx";
import { TbHome2 } from "react-icons/tb";

interface AttendanceClosedProps {
    
}

function AttendanceClosed() {
    return (
        <div className="flex flex-col items-center gap-4 border rounded-lg px-4 py-8 md:p-8 bg-white">
            <div className="flex justify-center">
                <RxLockClosed className="text-8xl text-sky-800" />
            </div>
            <h1 className="text-lg font-semibold text-center">Absensi Ditutup!</h1>
            <p className="text-center text-xs md:text-sm text-slate-400">
                Absensi sudah ditutup. Semoga harimu menyenangkan
            </p>
            {/* <div>
                <Link href="/student/face-registration" className="focus:ring-2 focus:ring-yellow-500 bg-yellow-200 text-yellow-700 font-semibold px-4 py-2 rounded-lg">
                    Rekam Wajah
                </Link>
            </div> */}
        </div>
    );
}

export default AttendanceClosed;