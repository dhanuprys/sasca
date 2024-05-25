'use client';

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { IoIosArrowForward, IoIosCalendar } from "react-icons/io";
import { TbHelp, TbKey, TbLogout2 } from "react-icons/tb";

interface MenuItemProps {
    icon: ReactNode;
    label: ReactNode;
    onClick?: () => unknown;
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
    return (
        <div onClick={() => onClick && onClick()} className="flex items-center gap-4 p-4 hover:bg-slate-100">
            <div className="shrink-0 [&>*]:text-xl">
                {icon}
            </div>
            <div className="flex-1">{label}</div>
            <div className="shrink-0">
                <IoIosArrowForward />
            </div>
        </div>
    );
}

function HomeMenu() {
    const router = useRouter();
    const { signOut } = useUser();

    return (
        <div className="rounded-xl bg-white border -translate-y-5">
            <MenuItem onClick={() => router.push('/admin/schedule')} icon={<IoIosCalendar />} label="Jadwal" />
            <hr />
            <MenuItem onClick={() => router.push('/admin/counselor')} icon={<TbKey />} label="BK" />
            <hr />
            <MenuItem onClick={() => router.push('/admin/student')} icon={<TbKey />} label="Siswa" />
            <hr />
            <MenuItem onClick={signOut} icon={<TbLogout2 className="text-red-500" />} label={<span className="text-red-500">Logout</span>} />
        </div>
    );
}

export default HomeMenu;