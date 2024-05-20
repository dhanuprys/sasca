'use client';

import Link from 'next/link';
import CommonWrapper from "@/wrappers/CommonWrapper";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { IoIosCalendar, IoMdStats } from "react-icons/io";
import { MdAccountCircle, MdHome, MdNotifications } from "react-icons/md";
import { FaChalkboardTeacher } from 'react-icons/fa';
import { IoMedalOutline } from 'react-icons/io5';

interface NavButtonProps {
    icon: ReactNode;
    label: string;
    target: string;
    special?: boolean;
    activePaths: string[];
}

function NavButton({ icon, label, target, special, activePaths }: NavButtonProps) {
    const pathname = usePathname();
    
    if (special) {
        return (
            <Link prefetch={true} href={target} className={`flex flex-col justify-center items-center relative box-content p-2 border-t-4 border-t-transparent ${activePaths.includes(pathname) ? '[&>*]:text-yellow-800 bg-yellow-50 !border-yellow-800' : '[&>*]:text-yellow-400 hover:cursor-pointer'}`}>
                {/* <div className="glowing-effect absolute top-1/2 left-1/2 -z-1"></div> */}
                <div className="[&>*]:text-xl">
                    {icon}
                </div>
                <span className="text-[10px] md:text-sm font-semibold">{label}</span>
            </Link>
        );
    }

    return (
        <Link prefetch={true} href={target} className={`flex flex-col justify-center items-center box-content p-2 border-t-4 border-t-transparent ${activePaths.includes(pathname) ? '[&>*]:text-sky-800 bg-sky-50 !border-t-sky-800' : '[&>*]:text-slate-500 hover:cursor-pointer'}`}>
            <div className="[&>*]:text-xl">
                {icon}
            </div>
            <span className="text-[10px] md:text-sm font-semibold">{label}</span>
        </Link>
    );
}


function BottomNavButton() {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow z-[600]">
            <CommonWrapper>
                <div className="grid grid-cols-4">
                    <NavButton icon={<MdHome />} label="Beranda" target="/student/home" activePaths={['/counselor/home']} />
                    {/* <NavButton icon={<MdNotifications />} label="Notifikasi" target="/counselor/notification" activePaths={['/counselor/notification']} /> */}
                    <NavButton icon={<FaChalkboardTeacher />} label="Kelas" target="/counselor/classroom" activePaths={['/counselor/classroom']} />
                    {/* <NavButton icon={<IoMedalOutline />} special={true} label="Peringkat" target="/counselor/leaderboard" activePaths={['/counselor/leaderboard']} /> */}
                    <NavButton icon={<IoIosCalendar />} label="Kalender" target="/counselor/schedule" activePaths={['/counselor/schedule']} />
                    <NavButton icon={<MdAccountCircle />} label="Profil" target="/counselor/profile" activePaths={['/counselor/profile']} />
                </div>
            </CommonWrapper>
        </div>
    );
}

export default BottomNavButton;