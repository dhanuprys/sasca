import CommonWrapper from "@/wrappers/CommonWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosArrowBack, IoIosRefresh } from "react-icons/io";

function CameraHeader() {
    const router = useRouter();

    return (
        <CommonWrapper>
            <div className="grid grid-cols-8 py-6 items-center">
                <div className="col-span-2">
                    <Link  href="/student/home" className="p-2">
                        <IoIosArrowBack />
                    </Link>
                </div>
                <div className="col-span-4 text-center">ABSEN DATANG</div>
                <div className="col-span-2 flex justify-end">
                    <Link href="#" onClick={() => router.refresh()} className="p-2">
                        <IoIosRefresh />
                    </Link>
                </div>
            </div>
        </CommonWrapper>
    );
}

export default CameraHeader;