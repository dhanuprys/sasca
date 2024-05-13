import CommonWrapper from '@/wrappers/CommonWrapper';
import Image from 'next/image';
import StudentStats from './StudentStats';

function ProfileHero() {
    return (
        <div>
            <div className="bg-sky-800 p-8 pb-12">
                <div>
                    
                </div>
                <div className="flex flex-col items-center justify-center py-5">
                    <Image className="w-[100px] h-[100px] object-cover rounded-full border-4 border-white bg-white" src="/" alt="profile" width={200} height={200} />
                    <h2 className="font-semibold text-lg text-white text-center mt-4">Gede Dhanu Purnayasa</h2>
                    <span className="text-slate-300">Siswa</span>
                </div>
            </div>
            <CommonWrapper className="-translate-y-1/2">
                <StudentStats />
            </CommonWrapper>
        </div>
    );
}

export default ProfileHero;