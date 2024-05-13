'use client';

import Skeleton from "@/components/Skeleton";
import DatasetUnavailable from "@/components/students/DatasetUnavailable";
import HolidayStatus from "@/components/students/HolidayStatus";
import ScheduleNotFound from "@/components/students/ScheduleNotFound";
import { swrFetcher } from "@/utils/swrFetcher";
import { IoCalendarClearOutline, IoTimeOutline } from "react-icons/io5";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import useSWRImmutable from "swr/immutable";
import { DateTime } from 'luxon';
import timeIsBetween from "@/utils/timeIsBetween";
import getCurrentTime from "@/utils/getCurrentTime";
import CurrentDateBadge from "@/components/CurrentDateBadge";
import CurrentTimeBadge from "@/components/CurrentTimeBadge";

interface AttendanceButtonItemProps {
    label: string;
    color: string;
    locked?: boolean;
}

function AttendanceButtonItem({ color, label, locked }: AttendanceButtonItemProps) {
    return (
        <div className={`px-4 py-2 bg-${color}-500 rounded-full text-xs text-white`}>
            {label}
        </div>
    );
}

function AttendanceButton() {
    const { data: todaySchedule, error: scheduleError, isLoading: scheduleLoading } = useSWRImmutable<any>(
        '/api/v1/schedule/today',
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );
    const { data: datasetAvailability, error: datasetError, isLoading: datasetLoading } = useSWRImmutable<any>(
        '/api/v1/student/face-sample',
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );
    const { data: checkStatus } = useSWRImmutable<any>(
        '/api/v1/student/attendance',
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );

    if (datasetLoading || scheduleLoading) {
        return <Skeleton style={{ height: '200px' }} />;
    }

    if (datasetError) {
        return <DatasetUnavailable />;
    }

    if (scheduleError) {
        return <ScheduleNotFound />;
    }

    if (todaySchedule && todaySchedule.holiday_reason) {
        return <HolidayStatus reason={todaySchedule.holiday_reason} />;
    }

    const checkinTime = checkStatus && checkStatus.check_in_time ?
                            DateTime.fromFormat(checkStatus.check_in_time, 'HH:mm:ss')
                            : null;

    return (
        <div className="flex flex-col gap-6 p-4 rounded-lg bg-white border">
            <div className="grid grid-cols-2">
                <div>
                    <CurrentDateBadge />
                </div>
                <div className="flex justify-end">
                    <CurrentTimeBadge />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="flex gap-4 items-center">
                    <div className="bg-slate-200 px-4 py-2 rounded font-semibold">{checkinTime ? checkinTime.toFormat('HH') : '--'}</div>
                    {/* <span>:</span> */}
                    <div className="bg-slate-200 px-4 py-2 rounded font-semibold">{checkinTime ? checkinTime.toFormat('mm') : '--'}</div>
                    {/* <span>:</span> */}
                    <div className="bg-slate-200 px-4 py-2 rounded font-semibold">{checkinTime ? checkinTime.toFormat('ss') : '--'}</div>
                </div>
            </div>

            <p className="text-center text-slate-400 text-xs">
                Anda dapat melakukan absen datang tepat waktu pada pukul {todaySchedule.checkin_start_time} hingga {todaySchedule.checkin_end_time}
            </p>
            <div className="grid grid-cols-2 gap-2">
                <button
                    disabled={
                        (checkStatus && checkStatus.check_in_time)
                        || getCurrentTime() < todaySchedule.checkin_start_time
                    } className="disabled:bg-slate-500 focus:ring-2 ring-sky-500 inline-flex justify-center items-center gap-1 p-2 bg-sky-700 rounded-lg text-white">
                    <TbLogin2 className="text-lg" />
                    <span className="text-xs">Absen Datang</span>
                </button>
                <button
                    disabled={
                        (checkStatus && checkStatus.check_out_time)
                        || !timeIsBetween([todaySchedule.checkout_start_time, todaySchedule.checkout_end_time])
                    } className="disabled:bg-slate-500 focus:ring-2 ring-red-500 inline-flex justify-center items-center gap-1 p-2 bg-red-700 rounded-lg text-white">
                    <TbLogout2 className="text-lg" />
                    <span className="text-xs">Absen Pulang</span>
                </button>
            </div>
        </div>
    );
}

export default AttendanceButton;