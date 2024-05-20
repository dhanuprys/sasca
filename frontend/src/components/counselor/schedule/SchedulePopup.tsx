import Skeleton from "@/components/Skeleton";
import ScheduleDetail from "@/components/shared/ScheduleDetail";
import ScheduleNotFound from "@/components/students/attendance/ScheduleNotFound";
import { swrFetcher } from "@/utils/swrFetcher";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import useSWRImmutable from "swr/immutable";

interface ClassReportButtonProps {
    classesId: string;
    className: string;
    date: string;
}

function ClassReportButton({ className, classesId, date }: ClassReportButtonProps) {
    return (
        <Link href={`/counselor/classroom/${classesId}/report?date=${date}`} className="hover:cursor-pointer hover:bg-slate-50 p-4 border rounded-xl bg-slate-100 flex items-center justify-between gap-2">
            <span>{className}</span>
            <IoIosArrowForward />
        </Link>
    );
}

interface SchedulePopupProps {
    date: string;
}

function SchedulePopup({ date }: SchedulePopupProps) {
    const { data: schedule, error: scheduleError, isLoading: scheduleLoading } = useSWRImmutable(
        `/api/v1/schedule?date=${date}`,
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );
    const { data: classes, error: classesError, isLoading: classesLoading } = useSWRImmutable(
        '/api/v1/counselor/classroom',
        swrFetcher
    );

    if (!schedule && scheduleLoading) {
        return <Skeleton style={{ height: '120px' }} />;
    }

    if ((scheduleError && scheduleError.response.status !== 404) || !schedule) {
        return <ScheduleNotFound borderless={true} />
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-semibold mb-2">Jadwal</h2>
                <div>
                    <ScheduleDetail schedule={schedule} />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Kelas</h2>
                <div className="flex flex-col gap-1">
                    {
                        !classes
                            ? 'loading...'
                            : classes.map((classroom: any) => {
                                return (
                                    <ClassReportButton
                                        key={classroom.id}
                                        classesId={classroom.id}
                                        className={classroom.class_name}
                                        date={date} />
                                );
                            })
                    }
                </div>
            </div>
        </div>
    );
}

export default SchedulePopup;