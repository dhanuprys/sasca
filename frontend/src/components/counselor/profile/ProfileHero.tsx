'use client';

import CommonWrapper from '@/wrappers/CommonWrapper';
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
                    <img className="w-[100px] h-[100px] object-cover rounded-full ring-4 ring-blue-500 bg-white" src={user && user.user.avatar_path ? `/api/_static/${user.user.avatar_path}` : '/user.webp'} alt="profile" />
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
                                ? user.user.nip
                                : <Skeleton style={{ height: '20px', width: '150px' }} />
                        }
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ProfileHero;