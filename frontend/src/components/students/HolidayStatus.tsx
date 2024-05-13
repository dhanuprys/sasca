import { TbHome2 } from "react-icons/tb";

interface HolidayStatusProps {
    reason: string;
}

function HolidayStatus({ reason }: HolidayStatusProps) {
    return (
        <div className="flex flex-col items-center gap-4 border rounded-lg px-4 py-8 md:p-8 bg-white">
            <div className="flex justify-center">
                <TbHome2 className="text-8xl text-sky-800" />
            </div>
            <h1 className="text-lg font-semibold text-center">Hari ini libur!</h1>
            <p className="text-center text-xs md:text-sm text-slate-400">
                {
                    reason && <>Dikarenakan hari ini adalah {reason}, maka siswa dapat beristirahat dan belajar di rumah.</>
                }
                Selamat menikmati liburan :)
            </p>
            {/* <div>
                <Link href="/student/face-registration" className="focus:ring-2 focus:ring-yellow-500 bg-yellow-200 text-yellow-700 font-semibold px-4 py-2 rounded-lg">
                    Rekam Wajah
                </Link>
            </div> */}
        </div>
    );
}

export default HolidayStatus;