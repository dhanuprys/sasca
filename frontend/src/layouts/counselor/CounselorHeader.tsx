'use client';

import CommonWrapper from "@/wrappers/CommonWrapper";
import useUser from '@/hooks/useUser';
import Skeleton from '@/components/Skeleton';

function CounselorHeader() {
    const { loading, user, error } = useUser();

    if (error) {
        return <>error</>;
    }

    return (
        <div>
            <CommonWrapper>
                <div className="grid grid-cols-4 items-center py-4 text-white">
                    <div className="col-span-3 flex gap-4 items-center">
                        <div className="shrink-0">
                            {
                                user && user.user
                                    ? <img className="w-[37px] h-[37px] bg-slate-200 rounded-full" src={user.user.avatar_path ? `/api/_static/${user.user.avatar_path}` : '/user.webp'} alt="image" />
                                    : <Skeleton style={{ height: '37px', width: '37px' }} />
                            }
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
                                        ? user.user.nip
                                        : <Skeleton style={{ height: '15px', width: '50px' }} />
                                }
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div>
                            {/* <IoNotifications className="w-[13px] h-[13px] box-content p-2 rounded-full text-sky-800 bg-white" /> */}
                        </div>
                        <div className="px-2 py-1 rounded-full bg-yellow-600 text-white text-xs">BK</div>
                    </div>
                </div>
            </CommonWrapper>
        </div>
    );
}

export default CounselorHeader;