'use client';

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { IoIosArrowForward } from "react-icons/io";
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

function ProfileMenu() {
    const router = useRouter();
    const { signOut } = useUser();

    return (
        <div className="rounded-xl bg-white border">
            <MenuItem icon={<TbHelp />} label="Tutorial" />
            <hr />
            <MenuItem onClick={() => router.push('/auth/change-password')} icon={<TbKey />} label="Ganti Password" />
            <hr />
            <MenuItem onClick={signOut} icon={<TbLogout2 className="text-red-500" />} label={<span className="text-red-500">Logout</span>} />
        </div>
    );
}

export default ProfileMenu;