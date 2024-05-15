'use client';

import useScannerStore from "@/context/useScannerStore";
import { ReactNode, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { IoIosWalk } from "react-icons/io";
import { MdOutlineShareLocation, MdOutlineWrongLocation } from "react-icons/md";

function CoordinateDetector() {
    // FEATURE SKIP
    const LOCATION_FEATURE_SKIP = process.env.NEXT_PUBLIC_LOCATION_FEATURE_SKIP;

    const { setCoordinates } = useScannerStore();
    const geolocation = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true
        },
        watchPosition: true
    });

    const [initialCoordinates, setInitialCoordinates] = useState<[number, number] | null>(null);
    const [progress, setProgress] = useState(0);
    const [icon, setIcon] = useState<ReactNode | null>(
        <div className="flex justify-center">
            <MdOutlineShareLocation className="text-8xl text-sky-800" />
        </div>
    );
    const [title, setTitle] = useState('Mendeteksi Kordinat');
    const [description, setDescription] = useState('Harap menunggu beberapa saat selagi kami menyiapkan kordinat');

    useEffect(() => {
        if (LOCATION_FEATURE_SKIP) return setCoordinates([100, 100]); 
        if (!geolocation.coords) return;

        const coordinate: [number, number] = [geolocation.coords.latitude, geolocation.coords.longitude];

        // DEV ONLY!
        if (LOCATION_FEATURE_SKIP) {
            return setCoordinates(coordinate);
        }

        if (!initialCoordinates) {
            setIcon(<IoIosWalk className="moving-object w-[120px] h-[120px]" />)
            setTitle('Harap untuk berpindah tempat');
            setDescription('Ini dilakukan untuk mendeteksi akurasi dari perangkat anda')
            setInitialCoordinates(coordinate);

            return;
        }

        if (initialCoordinates.join('') === coordinate.join('')) {
            return;
        }

        setCoordinates(coordinate);
    }, [geolocation]);

    useEffect(() => {
        if (!initialCoordinates) return;

        let maxSeconds = 60;
        let currentSecond = 0;

        const locationTimeoutProgress = setInterval(() => {
            currentSecond += 0.2;

            setProgress(currentSecond / maxSeconds * 100);

            if (currentSecond >= maxSeconds) {
                // Update halaman
                setIcon(
                    <div className="flex justify-center">
                        <MdOutlineWrongLocation className="text-8xl text-sky-800" />
                    </div>
                );
                setTitle('Lokasi tidak valid');
                setDescription('Harap untuk melakukan refresh halaman dan mencoba lagi');

                // Stop progress bar
                clearInterval(locationTimeoutProgress);
            }
        }, 200);

        return () => {
            clearInterval(locationTimeoutProgress)
        }
    }, [initialCoordinates]);

    return (
        <div className="bg-white border rounded-xl">
            {
                progress > 0 && <div className="w-[calc(100%-1.5rem)] mx-auto relative">
                    <div className=" bg-slate-100 h-1"></div>
                    <div className="absolute top-0 left-0 h-1 bg-sky-800" style={{ width: `${progress}%` }}></div>
                </div>
            }
            <div className="flex justify-center px-6 py-8">
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        {icon}
                    </div>
                    <h3 className="text-center font-semibold">{title}</h3>
                    <p className="text-slate-400 text-xs md:text-sm text-center">{description}</p>
                </div>
            </div>
        </div>
    );
}

export default CoordinateDetector;