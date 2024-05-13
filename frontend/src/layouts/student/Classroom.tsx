import Image from "next/image";

function StudentItem() {
    return (
        <div className="flex gap-2 hover:bg-slate-100 px-1 py-4">
            <div className="flex-auto flex items-center gap-2">
                <div className="shrink-0">
                    <Image src="/" alt="profile" width={40} height={40} className="w-[40px] h-[40px] rounded-full bg-slate-200" />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-sm">Gede Dhanu Purnayasa</h3>
                    <div className="flex gap-2 text-slate-400 text-xs">
                        <span>21693</span>
                        <span>.</span>
                        <span>Hadir</span>
                    </div>
                </div>
            </div>
            <div className="shrink-0">
                <div>#1</div>
            </div>
        </div>
    );
}

function Classroom() {
    return (
        <div className="flex flex-col gap-6 p-4 rounded-lg bg-white border">
            <h1 className="text-2xl font-semibold">Ruang Kelas</h1>
            <hr />
            <div>
                <StudentItem />
                <StudentItem />
                <StudentItem />
                <StudentItem />
            </div>
        </div>
    );
}

export default Classroom;