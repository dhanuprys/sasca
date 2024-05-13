'use client';

import Image from 'next/image';
import CommonWrapper from "@/wrappers/CommonWrapper";

function StudentHeader() {
    return (
        <div>
            <CommonWrapper>
                <div className="grid grid-cols-4 items-center py-4 text-white">
                    <div className="col-span-3 flex gap-4 items-center">
                        <div>
                            <Image className="w-[37px] h-[37px] bg-slate-200 rounded-full" src="/" alt="image" width={50} height={50} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold text-xs">Gede Dhanu Purnayasa</h2>
                            <span className="text-xs">Siswa</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div>
                            {/* <IoNotifications className="w-[13px] h-[13px] box-content p-2 rounded-full text-sky-800 bg-white" /> */}
                        </div>
                        <div className="px-2 py-1 rounded-full bg-yellow-600 text-white text-xs">TESTING</div>
                    </div>
                </div>
            </CommonWrapper>
        </div>
    );
}

export default StudentHeader;