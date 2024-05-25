import Skeleton from "@/components/Skeleton";
import ScheduleDetail from "@/components/shared/ScheduleDetail";
import ScheduleNotFound from "@/components/students/attendance/ScheduleNotFound";
import useBottomModalStore from "@/context/useBottomModal";
import { swrFetcher } from "@/utils/swrFetcher";
import useSWRImmutable from "swr/immutable";
import ScheduleCreation from "./ScheduleCreation";

interface ClassReportButtonProps {
    classesId: string;
    className: string;
    date: string;
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
    const { open: openModal } = useBottomModalStore();

    const changeSchedule = () => {
        openModal(
            <ScheduleCreation dates={[date]} />,
            'Simpan Jadwal'
        )
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <button className="w-full bg-red-500 rounded-xl text-white px-4 py-2" onClick={changeSchedule}>UBAH JADWAL</button>
            </div>
            {
                !schedule && scheduleLoading
                    ? <Skeleton style={{ height: '120px' }} />
                    : (scheduleError && scheduleError.response.status !== 404) || !schedule
                        ? <ScheduleNotFound borderless={true} />
                        :
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Jadwal</h2>
                            <div>
                                <ScheduleDetail schedule={schedule} />
                            </div>
                        </div>
            }
        </div>
    );
}

export default SchedulePopup;