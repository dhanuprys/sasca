'use client';

import calculateDistance from "@/utils/calculateDistance";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useGeolocated } from "react-geolocated";
import { RiMapPinLine, RiPinDistanceLine } from "react-icons/ri";

const MapCore = dynamic(() => import('@/components/MapCore'), { ssr: false });

function IntuitiveMapContainer() {
    const {
        coords,
        isGeolocationAvailable,
        isGeolocationEnabled
    } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        watchPosition: true,
        userDecisionTimeout: 10_000,
    });

    const distance = useMemo(() => {
        if (!coords) return 0;

        return Math.floor(calculateDistance(
            [-8.114308077832172, 115.09855832420878],
            [coords.latitude, coords.longitude]
        ) * 1000);
    }, [coords]);

    return (
        <div className="border rounded-xl">
            <div className="w-full h-[400px] rounded-t-xl bg-slate-300 relative">
                <MapCore
                    center={coords ? [coords.latitude, coords.longitude] : [-8.114308077832172, 115.09855832420878]}
                    radiusCenter={[-8.114308077832172, 115.09855832420878]}
                    pinLocation={coords ? [coords.latitude, coords.longitude] : undefined}
                    zoom={17} />
                {
                    (!isGeolocationEnabled || !isGeolocationAvailable) &&
                    <div>
                        <div className="absolute top-0 left-0 z-[500] w-full h-full bg-black opacity-55 rounded-t-xl"></div>
                        <div className="absolute top-0 left-0 z-[501] w-full h-full flex justify-center items-center">
                            <span className="text-white font-semibold">Hidupkan akses lokasi</span>
                        </div>
                    </div>
                }

                {
                    distance > 200 && <div className="absolute bottom-0 left-0 z-[502] w-full text-sm text-center animate-pulse bg-yellow-400 text-white px-4 py-2">
                        Jarak anda terlalu jauh!
                    </div>
                }
            </div>
            <div className="bg-white p-4 rounded-b-xl">
                <h2 className="font-semibold text-center">SMK Negeri 3 Singaraja</h2>
                <div className="grid grid-cols-12 gap-2 mt-6">
                    <div className="flex items-center col-span-5">
                        <RiMapPinLine className="text-3xl" />
                        <div className="pl-4">
                            <span className="font-semibold block text-sm">{distance} M</span>
                            <span className="text-slate-400 text-xs">Jarak Anda</span>
                        </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <div className="border-r"></div>
                    </div>
                    <div className="flex items-center col-span-5">
                        <RiPinDistanceLine className="text-3xl" />
                        <div className="pl-4">
                            <span className="font-semibold block text-sm text-blue-700">200 M</span>
                            <span className="text-slate-400 text-xs">Maks. Jarak</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 h-2 bg-slate-200 rounded-full w-1/3 mx-auto"></div>
            </div>
        </div>
    );
}

export default IntuitiveMapContainer;