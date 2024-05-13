'use client';

import CameraHeader from "@/components/students/CameraHeader";
import FaceRegistrationCamera from "@/components/students/registration/FaceRegistrationCamera";
import CommonWrapper from "@/wrappers/CommonWrapper";

/**
 * Pada saat melakukan deteksi wajah, ada dua komponen berbeda
 * yang akan digunakan pada dua tipe perangkat berbeda.
 * 
 * iPhone: FaceScannerIOS
 * Lain2 : FaceScannerCommon
 * @returns 
 */
function FaceRegistration() {
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