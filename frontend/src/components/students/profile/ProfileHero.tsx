'use client';

import CommonWrapper from '@/wrappers/CommonWrapper';
import Image from 'next/image';
import StudentStats from './StudentStats';
import useUser from '@/hooks/useUser';
import Skeleton from '@/components/Skeleton';

function ProfileHero() {
    const { user } = useUser();

    return (
        <div>
            <div className="bg-sky-800 p-8 pb-12">
                <div>

                </div>
                <div className="flex flex-col items-center justify-center py-5">
                    <Image className="w-[100px] h-[100px] object-cover rounded-full ring-4 ring-blue-500 bg-white" src="/user.webp" alt="profile" width={200} height={200} />
                    <h2 className="font-semibold text-lg text-white text-center mt-4">
                        {
                            user
                                ? user.user.name
                                : <Skeleton style={{ height: '27px', width: '200px' }} />
                        }
                    </h2>
                    <span className="text-slate-300 mt-2">
                        {
                            user
                                ? user.user.class_name
                                : <Skeleton style={{ height: '20px', width: '150px' }} />
                        }
                    </span>
                </div>
            </div>
            <CommonWrapper className="-translate-y-1/2">
                <StudentStats />
            </CommonWrapper>
        </div>
    );
}

export default ProfileHero;