"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Custom marker icons with your theme colors
const createCustomIcon = (color, isMax = false) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${
          isMax
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "linear-gradient(135deg, #ef4444, #dc2626)"
        };
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid ${isMax ? "#10b981" : "#ef4444"};
        box-shadow: 0 4px 12px rgba(${
          isMax ? "16, 185, 129" : "239, 68, 68"
        }, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">${isMax ? "▲" : "▼"}</div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Ontario city coordinates (approximate)
const getCityCoordinates = (cityName) => {
  const cityCoords = {
    "Leeds and the Thousand Islands": [44.4825, -76.0228],
    Assiginack: [45.7844, -82.0256],
    "North Glengarry": [45.3167, -74.6333],
    "North Frontenac": [44.8333, -76.8333],
    "Fort Frances": [48.6081, -93.4019],
    "Guelph/Eramosa": [43.6167, -80.1167],
    "St. Marys": [43.2567, -81.1411],
    Greenstone: [49.7, -87.25],
    Mapleton: [43.8833, -80.8833],
    "Georgian Bluffs": [44.5833, -81.0833],
    Vaughan: [43.8361, -79.4983],
    "South-West Oxford": [42.8833, -80.8333],
    "Arran-Elderslie": [44.25, -81.25],
    "Lanark Highlands": [45.0833, -76.5833],
    LaSalle: [42.2167, -83.05],
    Georgina: [44.2933, -79.4364],
    "St. Catharines": [43.1594, -79.2469],
    "Alnwick/Haldimand": [44.0833, -78.1667],
    Essex: [42.1833, -82.8167],
    "Greater Madawaska": [45.4167, -77.3333],
  };

  return cityCoords[cityName] || [43.6532, -79.3832]; // Default to Toronto if not found
};

export default function MapComponent({ data }) {
  const [isClient, setIsClient] = useState(false);

  data.minImpact.map((city, index) => console.log(city.impact_score)
  )

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[600px] bg-slate-800/50 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Initializing map...</div>
      </div>
    );
  }

  const minIcon = createCustomIcon("#ef4444", false);
  const maxIcon = createCustomIcon("#10b981", true);

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-slate-700/30">
      <MapContainer
        center={[44.2619, -79.9711]} // Center on Ontario
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Minimum Impact Cities */}
        {data.minImpact.map((city, index) => (
          <Marker
            key={`min-${index}`}
            position={getCityCoordinates(city.city)}
            icon={minIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="font-semibold text-white text-sm">
                    Minimum Impact
                  </h3>
                </div>
                <p className="text-slate-300 text-base font-extrabold">
                  {city.city}
                </p>
                <p className="font-extrabold text-slate-400 text-base">
                  Impact Score:{" "}
                  <span className="text-red-500">{city.impact_score}</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Maximum Impact Cities */}
        {data.maxImpact.map((city, index) => (
          <Marker
            key={`max-${index}`}
            position={getCityCoordinates(city.city)}
            icon={maxIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-white text-sm">
                    Maximum Impact
                  </h3>
                </div>
                <p className="text-slate-300 text-base font-extrabold">
                  {city.city}
                </p>
                <p className="font-extrabold text-slate-400 text-base">
                  Impact Score:{" "}
                  <span className="text-green-500">{city.impact_score}</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }

        .custom-popup .leaflet-popup-tip {
          background: #1e293b !important;
          border: 1px solid #475569 !important;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
        }

        .leaflet-container {
          background: #0f172a !important;
        }
      `}</style>
    </div>
  );
}
