import AttendanceStatus from "@/constant/AttendanceStatus";
import { useMemo } from "react";
import { FaRegFaceSadCry } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineHolidayVillage } from "react-icons/md";

interface AttendanceStatusBannerProps {
    status: string;
    borderless?: boolean;
}

function AttendanceStatusBanner({ status, borderless }: AttendanceStatusBannerProps) {
    const message = useMemo(() => {
        let output = {
            icon: <IoIosCheckmarkCircleOutline className="text-8xl text-sky-800" />,
            title: 'Absensi Lengkap!',
            description: 'Terimakasih telah melakukan absensi kehadiran pada hari ini'
        }

        switch (status) {
            case AttendanceStatus.SICK:
                output = {
                    icon: <FaRegFaceSadCry className="text-8xl text-sky-800" />,
                    title: 'Get Well Soon!',
                    description: 'Berisitirahatlah di rumah dan lekas sembuh. Kami mendoakanmu yang terbaik!'
                };
            break;
            case AttendanceStatus.PERMISSION_ABSENT:
                output = {
                    icon: <MdOutlineHolidayVillage className="text-8xl text-sky-800" />,
                    title: 'Izin kamu diterima',
                    description: 'Selamat menikmati izin sekolah. Cepat balik yaa!!'
                }
            break;
        }

        return output;
    }, []);

    return (
        <div className={`flex flex-col items-center gap-4 ${borderless ? '' : 'border'} rounded-lg px-4 py-8 md:p-8 bg-white`}>
            <div className="flex justify-center">
                {message.icon}
            </div>
            <h1 className="text-lg font-semibold text-center">{message.title}</h1>
            <p className="text-center text-xs md:text-sm text-slate-400">
                {message.description}
            </p>
            {/* <div>
                <Link href="/student/face-registration" className="focus:ring-2 focus:ring-yellow-500 bg-yellow-200 text-yellow-700 font-semibold px-4 py-2 rounded-lg">
                    Rekam Wajah
                </Link>
            </div> */}
        </div>
    );
}

export default AttendanceStatusBanner;