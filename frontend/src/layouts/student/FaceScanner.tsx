'use client';

import CameraHeader from "@/components/students/CameraHeader";
import FaceScannerCommon from "@/components/students/scanner/FaceScannerCommon";
import FaceScannerIOS from "@/components/students/scanner/FaceScannerIOS";
import CommonWrapper from "@/wrappers/CommonWrapper";
import MobileDetect from "mobile-detect";
import { useEffect, useState } from "react";

/**
 * Pada saat melakukan deteksi wajah, ada dua komponen berbeda
 * yang akan digunakan pada dua tipe perangkat berbeda.
 * 
 * iPhone: FaceScannerIOS
 * Lain2 : FaceScannerCommon
 * @returns 
 */
function FaceScanner() {
    const [phoneType, setPhoneType] = useState<string | null>(null);

    useEffect(() => {
        // Mendapatkan informasi tipe perangkat yang digunakan
        const md = new MobileDetect(window.navigator.userAgent);
        
        setPhoneType(md.phone());
    }, []);

    return (
        <div>
            <CameraHeader />
            <CommonWrapper>
                {
                    // Jika deteksi perangkat belum selesai dilakukan maka
                    // akan menampilkan loading
                    phoneType === null
                        ? 'loading...'
                        : phoneType === 'iPhone'
                            ? <FaceScannerIOS />
                            : <FaceScannerCommon />
                }
            </CommonWrapper>
        </div>
    );
}

export default FaceScanner;