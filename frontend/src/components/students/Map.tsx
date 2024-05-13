'use client';

import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, useMap, Popup, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocated } from 'react-geolocated';
import axios from 'axios';
import useSWRImmutable from 'swr/immutable';
import { useEffect, useLayoutEffect, useState } from 'react';
import calculateDistance from '@/utils/calculateDistance';
import addDistance from '@/utils/addDistance';

export default function MapLocation() {
  const [distance, setDistance] = useState(0);
  const { data: mapData, error } = useSWRImmutable('map', () => axios.get('/api/siswa/map').then((res) => res.data));
  const markIcon = L.icon({ iconUrl: '/man.png' });
  const {
    coords,
    isGeolocationEnabled
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    watchPosition: true,
    userDecisionTimeout: 10_000,
  });
  const [isMapReady, setMapReady] = useState<boolean>(false);

  useLayoutEffect(() => {
    setMapReady(true);

    return () => {
      setMapReady(false);
    };
  });

  const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();

    // Memindahkan posisi kursor
    map.flyTo(center);

    return null;
  }

  useEffect(() => {
    if (coords && mapData) {
      const distanceInM = Math.floor(
        calculateDistance(
          mapData.data.koordinat[0],
          mapData.data.koordinat[1],
          coords.latitude,
          coords.longitude
        ) * 1000);

      setDistance(distanceInM);
    }
  }, [coords, mapData]);

  if (!mapData || !isMapReady) {
    return <div className="skeleton skeleton-card h-[270px]"></div>;
  }

  let coordinatesRange: LatLngExpression[] = [];

  for (let i = 0; i <= 360; i++) {
    coordinatesRange.push(
      addDistance(
        mapData.data.koordinat[0],
        mapData.data.koordinat[1],
        mapData.data.maks_jarak, 
        i
      ) as LatLngExpression
    )
  }

  return (
    <>
      <h1 className="font-semibold text-xl">
        Area Absensi
        <span className="!text-sm ml-2 px-2 py-1 bg-blue-200 text-blue-700 rounded">{distance} M</span>
      </h1>
      {
        !isGeolocationEnabled
          ? <div className="animate-pulse bg-yellow-50 border border-yellow-200 text-yellow-500 font-semibold px-4 py-2 rounded">
              Harap menghidupkan izin lokasi
            </div>
          : null
      }
      <MapContainer
        className="rounded border h-[300px]"
        center={mapData.data.koordinat}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={true}
        tap={false}
        touchZoom={false}
        boxZoom={false}
        doubleClickZoom={false}
        zoomSnap={0}
        trackResize={false}
        zoom={mapData.data.zoom}>
        <MapController center={coords ? [coords.latitude, coords.longitude] : mapData.data.koordinat} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline pathOptions={{ fill: true, fillColor: 'blue' }} positions={coordinatesRange as LatLngExpression[]} />

        {
          !coords
            ? null
            : <Marker icon={markIcon} position={[coords.latitude, coords.longitude]}>
                <Popup>Anda</Popup>
            </Marker>
        }
      </MapContainer>
    </>
  );
};
