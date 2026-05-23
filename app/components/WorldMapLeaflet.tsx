"use client";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline } from "react-leaflet";

let _wm_key = 0;

const CITIES: [number, number][] = [
  [34.05,  -118.24],
  [40.71,   -74.01],
  [-23.55,  -46.63],
  [51.51,    -0.13],
  [6.52,      3.37],
  [25.20,    55.27],
  [19.07,    72.88],
  [1.35,    103.82],
  [35.68,   139.69],
  [-33.87,  151.21],
];

const ARCS: [[number,number],[number,number]][] = [
  [[34.05,-118.24], [40.71,-74.01]],
  [[40.71,-74.01],  [51.51,-0.13]],
  [[51.51,-0.13],   [25.20,55.27]],
  [[25.20,55.27],   [19.07,72.88]],
  [[19.07,72.88],   [1.35,103.82]],
  [[1.35,103.82],   [35.68,139.69]],
  [[40.71,-74.01],  [-23.55,-46.63]],
  [[-23.55,-46.63], [6.52,3.37]],
];

function arcPoints(a: [number,number], b: [number,number]): [number,number][] {
  const pts: [number,number][] = [];
  const midLat = (a[0] + b[0]) / 2 + Math.abs(b[1] - a[1]) * 0.15;
  const midLon = (a[1] + b[1]) / 2;
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    pts.push([
      (1-t)*(1-t)*a[0] + 2*(1-t)*t*midLat + t*t*b[0],
      (1-t)*(1-t)*a[1] + 2*(1-t)*t*midLon + t*t*b[1],
    ]);
  }
  return pts;
}

export default function WorldMapLeaflet({ scrollOffset = 0 }: { scrollOffset?: number }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mapKey = useRef(++_wm_key);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 761);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => {
      // destroy stale Leaflet instance so the container can be reused
      document.querySelectorAll(".wm-leaflet").forEach((el) => {
        const node = el as HTMLElement & { _leaflet_id?: number };
        if (node._leaflet_id != null) delete node._leaflet_id;
      });
    };
  }, []);

  if (!isDesktop || !mounted) return null;

  return (
    <div className="wm-wrap" style={{ transform: `translateY(${scrollOffset * 0.25}px)` }}>
      <MapContainer
        key={mapKey.current}
        center={[20, 10]}
        zoom={2}
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        keyboard={false}
        attributionControl={false}
        className="wm-leaflet"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={4}
          opacity={0.55}
        />
        {ARCS.map((conn, i) => (
          <Polyline
            key={i}
            positions={arcPoints(conn[0], conn[1])}
            pathOptions={{ color: "#b86cf9", weight: 1, opacity: 0.45, dashArray: "4 10" }}
          />
        ))}
        {CITIES.map((pos, i) => (
          <CircleMarker
            key={i}
            center={pos}
            radius={5}
            pathOptions={{ color: "#b86cf9", fillColor: "#b86cf9", fillOpacity: 1, weight: 0 }}
          />
        ))}
        {CITIES.map((pos, i) => (
          <CircleMarker
            key={`ring-${i}`}
            center={pos}
            radius={9}
            pathOptions={{ color: "#b86cf9", fillColor: "transparent", fillOpacity: 0, weight: 1, opacity: 0.35 }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
