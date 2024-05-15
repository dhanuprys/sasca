'use client';

import Image from 'next/image';
import CommonWrapper from "@/wrappers/CommonWrapper";
import useUser from '@/hooks/useUser';
import Skeleton from '@/components/Skeleton';

function StudentHeader() {
    const { loading, user, error } = useUser();

    if (error) {
        return <>error</>;
    }

    return (
        <div>
            <CommonWrapper>
                <div className="grid grid-cols-4 items-center py-4 text-white">
                    <div className="col-span-3 flex gap-4 items-center">
                        <div>
                            <Image className="w-[37px] h-[37px] bg-slate-200 rounded-full" src="/user.webp" alt="image" width={50} height={50} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="font-semibold text-xs">
                                {
                                    user
                                        ? user.user.name
                                        : <Skeleton style={{ height: '15px', width: '150px' }} />
                                }
                            </h2>
                            <span className="text-xs">
                                {
                                    user
                                        ? user.user.nisn
                                        : <Skeleton style={{ height: '15px', width: '50px' }} />
                                }
                            </span>
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