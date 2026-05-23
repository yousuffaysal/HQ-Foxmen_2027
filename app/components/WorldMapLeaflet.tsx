"use client";
import { useEffect, useRef, useState } from "react";

const CITIES: [number, number][] = [
  [34.05, -118.24], [40.71,  -74.01], [-23.55, -46.63],
  [51.51,   -0.13], [ 6.52,    3.37], [ 25.20,  55.27],
  [19.07,   72.88], [ 1.35,  103.82], [ 35.68, 139.69],
  [-33.87, 151.21],
];

const ARCS: [[number, number], [number, number]][] = [
  [[34.05,-118.24], [40.71,-74.01]],
  [[40.71,-74.01],  [51.51,-0.13]],
  [[51.51,-0.13],   [25.20,55.27]],
  [[25.20,55.27],   [19.07,72.88]],
  [[19.07,72.88],   [1.35,103.82]],
  [[1.35,103.82],   [35.68,139.69]],
  [[40.71,-74.01],  [-23.55,-46.63]],
  [[-23.55,-46.63], [6.52,3.37]],
];

function arcPoints(a: [number, number], b: [number, number]): [number, number][] {
  const pts: [number, number][] = [];
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 761);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop || !containerRef.current) return;

    // destroy any existing instance before creating a new one
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    import("leaflet").then((L) => {
      if (!containerRef.current) return;

      const map = L.map(containerRef.current, {
        center:            [20, 10],
        zoom:              2,
        zoomControl:       false,
        dragging:          false,
        touchZoom:         false,
        scrollWheelZoom:   false,
        doubleClickZoom:   false,
        keyboard:          false,
        attributionControl:false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 4, opacity: 0.55 }
      ).addTo(map);

      ARCS.forEach((conn) => {
        L.polyline(arcPoints(conn[0], conn[1]), {
          color: "#b86cf9", weight: 1, opacity: 0.45, dashArray: "4 10",
        }).addTo(map);
      });

      CITIES.forEach((pos) => {
        L.circleMarker(pos, {
          color: "#b86cf9", fillColor: "#b86cf9",
          fillOpacity: 1, weight: 0, radius: 5,
        }).addTo(map);
        L.circleMarker(pos, {
          color: "#b86cf9", fillColor: "transparent",
          fillOpacity: 0, weight: 1, opacity: 0.35, radius: 9,
        }).addTo(map);
      });

      mapRef.current = map;
    });

    return () => {
      // map.remove() is Leaflet's official teardown — clears _leaflet_id,
      // all layers, and event listeners from the DOM element
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div className="wm-wrap" style={{ transform: `translateY(${scrollOffset * 0.25}px)` }}>
      <div ref={containerRef} className="wm-leaflet" />
    </div>
  );
}
