import CommonWrapper from "@/wrappers/CommonWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosArrowBack, IoIosRefresh } from "react-icons/io";

interface CameraHeaderProps {
    title: string;
}

function CameraHeader({ title }: CameraHeaderProps) {
    const router = useRouter();

    const backToHome = () => {
        router.replace('/student/home');
    };

    const forceRefresh = () => {
        window.location.href = window.location.href;
    }

    return (
        <CommonWrapper>
            <div className="grid grid-cols-8 py-6 items-center">
                <div className="col-span-2">
                    <button onClick={backToHome}  className="p-2">
                        <IoIosArrowBack />
                    </button>
                </div>
                <div className="col-span-4 text-center">{title}</div>
                <div className="col-span-2 flex justify-end">
                    <button onClick={forceRefresh} className="p-2">
                        <IoIosRefresh />
                    </button>
                </div>
            </div>
        </CommonWrapper>
    );
}

export default CameraHeader;