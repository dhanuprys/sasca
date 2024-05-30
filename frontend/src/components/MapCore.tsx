'use client';

import { MapContainer, TileLayer, Tooltip, Marker, useMap, Polyline, CircleMarker, Circle } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReactNode, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import addDistance from '@/utils/addDistance';
import Skeleton from './Skeleton';
import useMapStore from '@/context/useMapStore';
import calculateDistance from '@/utils/calculateDistance';

const MapController = ({ center, zoom }: { center: LatLngExpression, zoom: number }) => {
    const { previousCoordinates, setPreviousCoordinates, isAllowUpdate, restrictUpdate } = useMapStore();
    const map = useMap();

    if (
        !isAllowUpdate
        || (previousCoordinates && (JSON.stringify(center) === JSON.stringify(previousCoordinates)))
    ) {
        return null;
    }

    // Memindahkan posisi kursor
    map.flyTo(center, zoom);

    setPreviousCoordinates(center as [number, number]);
    restrictUpdate();

    return null;
};

interface LocationPin {
    coordinates: LatLngExpression;
    label?: ReactNode;
}

interface MapCoreProps {
    center: LatLngExpression;
    zoom: number;
    radius?: {
        center: LatLngExpression;
        length: number;
    };
    pins?: LocationPin[];
    minUpdateInterval?: number;
}

function MapCore({ center, zoom, radius, pins, minUpdateInterval }: MapCoreProps) {
    const [isMapReady, setMapReady] = useState(false);
    const { isAllowUpdate, allowUpdate, setPreviousCoordinates } = useMapStore();

    const markIcon = L.icon({
        iconUrl: '/man.png',
        iconSize: [
            13, 39
        ],
        iconAnchor: [
            0, 45
        ],
        tooltipAnchor: [
            0, -30
        ]
    });

    // const radiusPaths = useMemo(() => {
    //     if (!radius) return [];

    //     let result = [];
    //     for (let i = 1; i <= 360; i++) {
    //         result.push(
    //             addDistance(
    //                 radius.center as [number, number],
    //                 radius.length,
    //                 i
    //             ) as LatLngExpression
    //         )
    //     }

    //     return result;
    // }, []);

    const isOutOfRange = useMemo(() => {
        if (!radius || !radius.center) return 0;

        const distance = calculateDistance(center as [number, number], radius.center as [number, number]) * 1000;

        return distance > radius.length;
    }, [center]);

    useLayoutEffect(() => {
        setMapReady(true);

        return () => {
            setMapReady(false);
        };
    });

    // Attribution remove
    useEffect(() => {
        if (!isMapReady) return;

        const attribution = document.body.querySelector('.leaflet-control-attribution');

        if (attribution) {
            attribution.remove();
        }

        setPreviousCoordinates(center as [number, number]);
    }, [isMapReady]);

    useEffect(() => {
        if (!isMapReady || isAllowUpdate) return;

        let unlocker = setTimeout(() => {
            allowUpdate();
        }, minUpdateInterval || 0);

        return () => clearTimeout(unlocker);
    }, [isMapReady, isAllowUpdate]);

    if (!isMapReady) {
        return <Skeleton style={{ height: '300px' }} />
    }

    return (
        <MapContainer
            className="rounded border h-full"
            center={center}
            zoomControl={true}
            scrollWheelZoom={false}
            dragging={true}
            tap={false}
            touchZoom={true}
            boxZoom={false}
            doubleClickZoom={false}
            zoomSnap={0}
            trackResize={false}
            zoom={zoom}
            maxZoom={22}>
            <MapController center={center} zoom={zoom} />
            {/* <TileLayer
                attribution="Open Street Map"
                maxZoom={25}
                maxNativeZoom={25}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            <TileLayer
                attribution="Google Maps"
                maxZoom={25}
                maxNativeZoom={25}
                url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            />
            {/* <Polyline pathOptions={{ fill: true, fillColor: 'blue' }} positions={radiusPaths} /> */}
            {radius && <Circle center={radius.center} radius={radius.length} />}
            {
                radius && (
                    <Polyline
                        positions={[center, radius.center]}
                        pathOptions={{
                            opacity: isOutOfRange ? 1 : 0.3,
                            color: isOutOfRange ? 'red' : 'green',
                            weight: isOutOfRange ? 2 : 0.5
                        }} />
                )
            }
            {/* <Polyline pathOptions={{ color: 'red' }} positions={[]} /> */}

            {
                pins && pins.map((pin) => {
                    return (
                        <Marker key={0} icon={markIcon} position={pin.coordinates}>
                            {pin.label && <Tooltip>{pin.label}</Tooltip>}
                        </Marker>
                    )
                })
            }
        </MapContainer>
    );
}

export default MapCore;