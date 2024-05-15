'use client';

import CameraHeader from "@/components/students/CameraHeader";
import FaceRegistrationCamera from "@/components/students/registration/FaceRegistrationCamera";
import { swrFetcher } from "@/utils/swrFetcher";
import CommonWrapper from "@/wrappers/CommonWrapper";
import { useRouter } from "next/navigation";
import useSWRImmutable from "swr/immutable";

/**
 * Pada saat melakukan deteksi wajah, ada dua komponen berbeda
 * yang akan digunakan pada dua tipe perangkat berbeda.
 * 
 * iPhone: FaceScannerIOS
 * Lain2 : FaceScannerCommon
 * @returns 
 */
function FaceRegistration() {
    const router = useRouter();
    const { data: datasetAvailability, error: datasetError, isLoading: datasetLoading } = useSWRImmutable<any>(
        '/api/v1/student/face-sample',
        swrFetcher,
        {
            shouldRetryOnError: false
        }
    );

    if (!datasetError) {
        router.push('/student/home');

        return <>Redirecting...</>
    }
    
    return (
        <div>
            <CameraHeader />
            <CommonWrapper>
                <FaceRegistrationCamera />
            </CommonWrapper>
        </div>
    );
}

export default FaceRegistration;