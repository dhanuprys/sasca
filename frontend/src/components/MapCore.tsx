'use client';

import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, useMap, Popup, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import addDistance from '@/utils/addDistance';
import Skeleton from './Skeleton';

const MapController = ({ center, zoom }: { center: LatLngExpression, zoom: number }) => {
    const map = useMap();

    // Memindahkan posisi kursor
    map.flyTo(center, zoom);

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
}

function MapCore({ center, zoom, radius, pins }: MapCoreProps) {
    const [isMapReady, setMapReady] = useState(false);
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

    const radiusPaths = useMemo(() => {
        if (!radius) return [];

        let result = [];
        for (let i = 1; i <= 360; i++) {
            result.push(
                addDistance(
                    radius.center as [number, number],
                    radius.length,
                    i
                ) as LatLngExpression
            )
        }

        return result;
    }, []);

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
    }, [isMapReady]);

    if (!isMapReady) {
        return <Skeleton style={{ height: '300px' }} />
    }

    console.log(pins!.length);

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
            zoom={zoom}>
            <MapController center={center} zoom={zoom} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={{ fill: true, fillColor: 'blue' }} positions={radiusPaths} />

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