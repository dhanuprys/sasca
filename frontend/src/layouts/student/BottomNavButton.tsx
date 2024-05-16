'use client';

import Link from 'next/link';
import CommonWrapper from "@/wrappers/CommonWrapper";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { IoMdStats } from "react-icons/io";
import { MdAccountCircle, MdHome, MdNotifications } from "react-icons/md";
import { FaChalkboardTeacher } from 'react-icons/fa';

interface NavButtonProps {
    icon: ReactNode;
    label: string;
    target: string;
    activePaths: string[];
}

function NavButton({ icon, label, target, activePaths }: NavButtonProps) {
    const pathname = usePathname();

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
                <div className="grid grid-cols-5">
                    <NavButton icon={<MdHome />} label="Beranda" target="/student/home" activePaths={['/student/home']} />
                    <NavButton icon={<MdNotifications />} label="Notifikasi" target="/student/notification" activePaths={['/student/notification']} />
                    <NavButton icon={<FaChalkboardTeacher />} label="Kelas" target="/student/classroom" activePaths={['/student/classroom']} />
                    <NavButton icon={<IoMdStats />} label="Laporan" target="/student/report" activePaths={['/student/report']} />
                    <NavButton icon={<MdAccountCircle />} label="Profil" target="/student/profile" activePaths={['/student/profile']} />
                </div>
            </CommonWrapper>
        </div>
    );
}

export default BottomNavButton;