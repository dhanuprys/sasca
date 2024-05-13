function StatItem() {
    return (
        <div className="flex flex-col justify-center items-center">
            <h4 className="text-sky-800 font-bold">555</h4>
            <span className="text-xs text-slate-400">Hadir</span>
        </div>
    );
}

function StudentStats() {
    return (
        <div className="grid grid-cols-4 p-4 bg-white border rounded-xl">
            <StatItem />
            <StatItem />
            <StatItem />
            <StatItem />
        </div>
    );
}

export default StudentStats;