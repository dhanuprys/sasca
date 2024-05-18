interface AttendanceMapProps {
    checkIn: [number, number];
    checkOut: [number, number];
}

function AttendanceMap({ checkIn, checkOut }: AttendanceMapProps) {
    return (
        <div className="max-w-full overflow-x-auto">
            <div className="w-[200%] grid grid-cols-2">
                <div className="col-span-1">
                    HELLO BROTHER
                </div>
                <div className="col-span-1">
                    HELLO BROTHER 2
                </div>
            </div>
        </div>
    );
}

export default AttendanceMap;