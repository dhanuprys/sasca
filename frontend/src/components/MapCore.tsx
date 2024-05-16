'use client';

import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, useMap, Popup, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useLayoutEffect, useState } from 'react';

const MapController = ({ center, zoom }: { center: LatLngExpression, zoom: number }) => {
    const map = useMap();

    // Memindahkan posisi kursor
    map.flyTo(center, zoom);

    return null;
};
interface MapCoreProps {
    center: LatLngExpression;
    zoom: number;
}

function MapCore({ center, zoom }: MapCoreProps) {
    const [isMapReady, setMapReady] = useState(false);
    const markIcon = L.icon({ iconUrl: '/man.png' });

    useLayoutEffect(() => {
        setMapReady(true);

        return () => {
            setMapReady(false);
        };
    });

    return (
        <MapContainer
            className="rounded border h-full"
            center={center}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={true}
            tap={false}
            touchZoom={false}
            boxZoom={false}
            doubleClickZoom={false}
            zoomSnap={0}
            trackResize={false}
            zoom={zoom}>
            <MapController center={center} zoom={zoom} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={{ fill: true, fillColor: 'blue' }} positions={[]} />

            {
                // !coords
                //     ? null
                //     : <Marker icon={markIcon} position={[coords.latitude, coords.longitude]}>
                //         <Popup>Anda</Popup>
                //     </Marker>
            }
        </MapContainer>
    );
}

export default MapCore;