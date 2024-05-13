import { MdOutlineScience } from "react-icons/md";

function ApplicationTestingBanner() {
    return (
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg flex flex-col gap-2 px-6 py-8 text-neutral-700">
            <div className="flex justify-center">
                <MdOutlineScience className="!text-6xl text-yellow-500" />
            </div>
            <h2 className="text-center text-sm font-semibold">APLIKASI SEDANG DALAM MASA PENGUJIAN</h2>
            <p className="text-xs text-center">
                Saat ini aplikasi sedang dalam masa pengujian. Harap untuk melaporkan <i>error</i> pada aplikasi
            </p>
        </div>
    );
}

export default ApplicationTestingBanner;