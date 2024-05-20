import { swrFetcher } from "@/utils/swrFetcher";
import useSWRImmutable from "swr/immutable";
import Skeleton from "../../Skeleton";
import HolidayStatus from "./HolidayStatus";
import { DateTime } from "luxon";
import ScheduleNotFound from "./ScheduleNotFound";
import AttendanceStatus from "@/constant/AttendanceStatus";
import AttendanceStatusBanner from "./AttendanceStatusBanner";
import MapCore from "@/components/MapCore";
import { useRef, useState } from "react";
import { MdOutlineAccessTime } from "react-icons/md";
import AttendanceNotFound from "./AttendanceNotFound";
import { FaArrowDown } from "react-icons/fa6";
import ScheduleDetail from "@/components/shared/ScheduleDetail";

interface MainDetailProps {
    attendance: {
        check_in_time: string;
        check_out_time: string;
        check_in_coordinate: [number, number];
        check_out_coordinate: [number, number];
        status: AttendanceStatus;
    }
}

function MainDetail({ attendance }: MainDetailProps) {
    const { status, check_in_time, check_out_time, check_in_coordinate, check_out_coordinate } = attendance;

    const [checkInPanelOpen, setCheckInPanelOpen] = useState(true);

    const detailPanel = useRef<HTMLDivElement>(null);
    const rightPanel = useRef<HTMLDivElement>(null);

    const openCheckIn = () => {
        if (!detailPanel.current) return;

        setCheckInPanelOpen(true);

        detailPanel.current.scroll({
            left: 0,
            behavior: 'smooth'
        });
    }

    const openCheckOut = () => {
        if (!detailPanel.current || !rightPanel.current) return;

        setCheckInPanelOpen(false);

        detailPanel.current.scroll({
            left: rightPanel.current.offsetLeft,
            behavior: 'smooth'
        });
    }

    if (!check_in_time && !status) {
        return (
            <AttendanceNotFound borderless={true} />
        );
    }

    if (
        ![AttendanceStatus.PRESENT, AttendanceStatus.PRESENT_LATE, null].includes(status)
        || (!check_in_time && !check_out_time && status)
    ) {
        return (
            <AttendanceStatusBanner borderless={true} status={status} />
        );
    }

    return (
        <div>
            <div className="grid grid-cols-2 rounded-xl text-sm p-0.5 border mb-2">
                <div onClick={openCheckIn} className={`hover:cursor-pointer py-2 text-center ${checkInPanelOpen ? 'text-sky-700 font-semibold bg-slate-100' : 'hover:bg-slate-50'}  rounded-xl`}>DATANG</div>
                <div onClick={openCheckOut} className={`hover:cursor-pointer py-2 text-center ${!checkInPanelOpen ? 'text-sky-700 font-semibold bg-slate-100' : 'hover:bg-slate-50'} rounded-xl`}>PULANG</div>
            </div>
            <div ref={detailPanel} className="max-w-full overflow-hidden">
                <div className="w-[200%] grid grid-cols-2">
                    <div className="col-span-1">
                        <div>
                            <div className="h-[300px]">
                                <MapCore center={check_in_coordinate} zoom={17} pins={[{ coordinates: check_in_coordinate }]} />
                            </div>
                            <div className="mt-2 p-4 flex items-center gap-2 rounded-xl bg-sky-800 text-white">
                                <MdOutlineAccessTime />
                                <span>{check_in_time}</span>
                            </div>
                        </div>
                    </div>
                    <div ref={rightPanel} className="col-span-1">
                        {
                            check_out_time
                                ? <div>
                                    <div className="h-[300px]">
                                        <MapCore center={check_in_coordinate} zoom={17} pins={[{ coordinates: check_out_coordinate }]} />
                                    </div>
                                    <div className="mt-2 p-4 flex items-center gap-2 rounded-xl bg-sky-800 text-white">
                                        <MdOutlineAccessTime />
                                        <span>{check_out_time}</span>
                                    </div>
                                </div>
                                : <AttendanceNotFound borderless={true} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

interface AttendanceDetailProps {
    date: string;
}

function AttendanceDetail({ date }: AttendanceDetailProps) {
    const { data: schedule, error: scheduleError, isLoading: scheduleLoading } = useSWRImmutable(
        `/api/v1/schedule?date=${date}`,
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );

    const { data: attendance, error: attendanceError, isLoading: attendanceLoading } = useSWRImmutable(
        `/api/v1/student/attendance?date=${date}`,
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-semibold mb-2">Jadwal</h2>
                <div>
                    {
                        !schedule && scheduleLoading && <Skeleton style={{ height: '120px' }} />
                    }
                    {
                        !scheduleError && schedule
                            ? <ScheduleDetail schedule={schedule} />
                            : <ScheduleNotFound borderless={true} />
                    }
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Kehadiran</h2>
                <div>
                    {
                        !attendance && attendanceLoading && <Skeleton style={{ height: '120px' }} />
                    }
                    {
                        !attendanceError && attendance
                            ? <MainDetail attendance={attendance} />
                            : <AttendanceNotFound borderless />
                    }
                </div>
            </div>
        </div>
    );
}

export default AttendanceDetail;