'use client';

import getBrowserInfo from "@/utils/getBrowserInfo";
import MobileDetect from "mobile-detect";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import UAParser from "ua-parser-js";

interface BrowserBannerProps {
    borderless?: boolean;
}

function BrowserBanner({ borderless }: BrowserBannerProps) {
    const [browserInfo, setBrowserInfo] = useState<UAParser.IBrowser | null>(null);
    useEffect(() => {
        const ua = getBrowserInfo();
        const md = new MobileDetect(window.navigator.userAgent);
        const isMobile = md.isPhoneSized();

        if (!isMobile) return;

        setBrowserInfo(ua);
    }, []);

    if (!browserInfo || (browserInfo.name?.toLowerCase() === 'chrome' && browserInfo.version?.startsWith('125'))) {
        return null;
    }

    return (
        <div className={`flex flex-col items-center gap-4 ${borderless ? '' : 'border'} rounded-lg px-4 py-8 md:p-8 bg-white`}>
            <div className="flex justify-center">
                <Image src="/chrome.png" width={100} height={100} alt="Chrome" />
            </div>
            <h1 className="text-lg font-semibold text-center">Harap Gunakan Chrome!</h1>
            <p className="text-center text-xs md:text-sm text-slate-400">
                Anda menggunakan browser {browserInfo.name} dengan versi {browserInfo.version}. Harap menggunakan browser
                Chrome versi 125 ke atas. Anda dapat melakukan update pada Google Play Store atay App Store.
            </p>
            {/* <div>
                <Link href="/student/face-registration" className="focus:ring-2 focus:ring-yellow-500 bg-yellow-200 text-yellow-700 font-semibold px-4 py-2 rounded-lg">
                    Rekam Wajah
                </Link>
            </div> */}
        </div>
    );
}

export default BrowserBanner;