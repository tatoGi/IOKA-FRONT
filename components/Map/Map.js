import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";

// Custom marker icon style
const createCustomIcon = (label) => {
  return L.divIcon({
    className: styles.priceMarker,
    html: `<div>${label}</div>`,
    iconSize: [60, 40],
    iconAnchor: [30, 40]
  });
};

const Map = ({ locations }) => {
  const extractLatLng = (googleMapsLink) => {
    const match = googleMapsLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match ? [parseFloat(match[1]), parseFloat(match[2])] : [0, 0];
  };

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        zoomControlPosition="topright"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {locations && locations.map((location, index) => {
          const [latitude, longitude] = extractLatLng(location.google_maps_link);
          return (
            <Marker
              key={index}
              position={[latitude, longitude]}
              icon={createCustomIcon(location.label)}
            >
              <Popup>{location.label}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
