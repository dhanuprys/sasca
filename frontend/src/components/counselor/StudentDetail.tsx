import StudentStats from "./profile/StudentStats";

interface StudentDetailProps {
    id: number;
}

function StudentDetail({ id }: StudentDetailProps) {
    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-2">
                <img src="" className="w-[120px] h-[120px] bg-slate-100 rounded-full" />
                <h3 className="font-semibold text-xl">Gede Dhanu Purnayasa</h3>
                <span>XII TJKT 3</span>
            </div>
        </div>
    );
}

export default StudentDetail;