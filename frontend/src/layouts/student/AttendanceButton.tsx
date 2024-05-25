'use client';

import Skeleton from "@/components/Skeleton";
import DatasetUnavailable from "@/components/students/DatasetUnavailable";
import HolidayStatus from "@/components/students/attendance/HolidayStatus";
import ScheduleNotFound from "@/components/students/attendance/ScheduleNotFound";
import { swrFetcher } from "@/utils/swrFetcher";
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import useSWRImmutable from "swr/immutable";
import { DateTime } from 'luxon';
import timeIsBetween from "@/utils/timeIsBetween";
import CurrentDateBadge from "@/components/CurrentDateBadge";
import CurrentTimeBadge from "@/components/CurrentTimeBadge";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import now from "@/utils/now";
import { IoIosInformationCircleOutline } from "react-icons/io";
import AttendanceClosed from "@/components/students/AttendanceClosed";
import AttendanceStatusBanner from "@/components/students/attendance/AttendanceStatusBanner";

function AttendanceButton() {
    const router = useRouter();
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
        '/api/v1/student/attendance/check',
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );

    const checkinTime = useMemo(() => {
        return checkStatus && checkStatus.check_in_time ?
            DateTime.fromFormat(checkStatus.check_in_time.substring(0, 12), 'HH:mm:ss')
            : null;
    }, [checkStatus]);
    const attendanceComplete = useMemo(() => checkStatus && (checkStatus.check_in_time && checkStatus.check_out_time), [checkStatus]);
    const isCheckInLate = useMemo(() => todaySchedule && now().toFormat('HH:mm:ss') > todaySchedule.checkin_end_time, [todaySchedule]);
    const isCheckOutLate = useMemo(() => todaySchedule && now().toFormat('HH:mm:ss') > todaySchedule.checkout_end_time, [todaySchedule]);
    const isButtonDisabled = useMemo(() => {
        return {
            checkIn: (checkStatus && checkStatus.check_in_time)
                || todaySchedule && now().toFormat('HH:mm:ss') < todaySchedule.checkinout_startime,
            checkOut: (!checkStatus || (!checkStatus.check_in_time || checkStatus.check_out_time))
                || (todaySchedule && !timeIsBetween([todaySchedule.checkout_start_time, todaySchedule.checkout_end_time]))
        }
    }, [checkStatus, todaySchedule]);

    if (datasetLoading || scheduleLoading) {
        return <Skeleton style={{ height: '200px' }} />;
    }

    if (datasetError) {
        return <DatasetUnavailable />;
    }

    if (scheduleError) {
        return <ScheduleNotFound />;
    }

    if (todaySchedule && todaySchedule.is_holiday) {
        return <HolidayStatus reason={todaySchedule.holiday_reason} />;
    }

    if (checkStatus && checkStatus.status) {
        return <AttendanceStatusBanner status={checkStatus.status} />
    }

    // if (attendanceComplete) {
    //     return <AttendanceComplete />;
    // }

    if (isCheckOutLate) {
        return <AttendanceClosed />;
    }

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

            <div className="flex justify-center gap-1 items-start">
                {/* <div>
                    <IoIosInformationCircleOutline className="text-slate-400" />
                </div> */}
                <p className="text-center text-slate-400 text-xs">
                    {
                        !checkStatus || !checkStatus.check_in_time
                            ? <>Anda dapat melakukan absen datang tepat waktu pada pukul <span className="font-semibold text-sky-800">{todaySchedule.checkin_start_time}</span> hingga <span className="font-semibold text-sky-800">{todaySchedule.checkin_end_time}</span></>
                            : <>Anda dapat melakukan absen pulang tepat waktu pada pukul <span className="font-semibold text-sky-800">{todaySchedule.checkout_start_time}</span> hingga <span className="font-semibold text-sky-800">{todaySchedule.checkout_end_time}</span></>
                    }
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => router.push('/student/check/in')}
                    disabled={isButtonDisabled.checkIn}
                    className={`${isCheckInLate && !isButtonDisabled.checkIn ? 'animate-pulse !bg-yellow-700' : ''} disabled:bg-slate-500 focus:ring-2 ring-sky-500 inline-flex justify-center items-center gap-1 p-2 bg-sky-700 rounded-lg text-white`}>

                    <TbLogin2 className="text-lg" />
                    <span className="text-xs">Absen Datang</span>
                </button>
                <button
                    onClick={() => router.push('/student/check/out')}
                    disabled={isButtonDisabled.checkOut}
                    className="disabled:bg-slate-500 focus:ring-2 ring-red-500 inline-flex justify-center items-center gap-1 p-2 bg-red-700 rounded-lg text-white">

                    <TbLogout2 className="text-lg" />
                    <span className="text-xs">Absen Pulang</span>
                </button>
            </div>
        </div>
    );
}

export default AttendanceButton;