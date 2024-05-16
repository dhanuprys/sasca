'use client';

import CameraHeader from "@/components/students/CameraHeader";
import CoordinateDetector from "@/components/students/scanner/CoordinateDetector";
import FaceScannerCommon from "@/components/students/scanner/FaceScannerCommon";
import FaceScannerIOS from "@/components/students/scanner/FaceScannerIOS";
import useScannerStore from "@/context/useScannerStore";
import { swrFetcher } from "@/utils/swrFetcher";
import CommonWrapper from "@/wrappers/CommonWrapper";
import MobileDetect from "mobile-detect";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWRImmutable from "swr/immutable";

interface FaceScannerProps {
    checkType: 'in' | 'out' | string;
}

/**
 * Pada saat melakukan deteksi wajah, ada dua komponen berbeda
 * yang akan digunakan pada dua tipe perangkat berbeda.
 * 
 * iPhone: FaceScannerIOS
 * Lain2 : FaceScannerCommon
 * @returns 
 */
function FaceScanner({ checkType }: FaceScannerProps) {
    const router = useRouter();
    const [phoneType, setPhoneType] = useState<string | null>(null);
    const { coordinates } = useScannerStore();

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

    useEffect(() => {
        // Mendapatkan informasi tipe perangkat yang digunakan
        const md = new MobileDetect(window.navigator.userAgent);

        setPhoneType(md.phone() || 'android');
    });

    const scannerTitle = useMemo(() => {
        return checkType === 'in' ? 'ABSEN DATANG' : 'ABSEN PULANG'
    }, []);
    const isHoliday = useMemo(() => (todaySchedule && todaySchedule.holiday_reason), [todaySchedule]);
    const isChecked = useMemo(() => {
        if (!checkStatus || ['in', 'out'].includes(checkType)) return false;

        if (checkType === 'in') {
            return checkStatus.check_in_time;
        } else if (checkType === 'out') {
            return checkStatus.check_out_time;
        }
    }, [checkStatus]);
    const ScannerWrap = useMemo(() =>
        // Jika deteksi perangkat belum selesai dilakukan maka
        // akan menampilkan loading
        phoneType === null
            ? <p>loading...</p>
            : phoneType === 'iPhone'
                ? <FaceScannerIOS checkType={checkType} />
                : <FaceScannerCommon checkType={checkType} />

        , [phoneType]);

    if (
        datasetError 
        || scheduleError
        || isHoliday
        || isChecked
    ) {
        router.push('/student/home');

        return <>Redirect...</>;
    }

    return (
        <div>
            <CameraHeader title={scannerTitle} />
            <CommonWrapper>
                {
                    !coordinates
                        ? <CoordinateDetector />
                        : ScannerWrap
                }
            </CommonWrapper>
        </div>
    );
}

export default FaceScanner;