import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";

// Custom marker icon style
const createCustomIcon = (price) => {
  return L.divIcon({
    className: styles.priceMarker,
    html: `<div>$${price}</div>`,
    iconSize: [60, 40],
    iconAnchor: [30, 20]
  });
};

const Map = () => {
  // Define locations with prices
  const locations = [
    { position: [51.5074, -0.1278], price: 89 }, // UK
    { position: [48.8566, 2.3522], price: 55 }, // France
    { position: [41.9028, 12.4964], price: 92 }, // Italy
    { position: [40.4168, -3.7038], price: 61 }, // Spain
    { position: [39.9334, 32.8597], price: 81 } // Turkey
  ];

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

        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location.position}
            icon={createCustomIcon(location.price)}
          >
            <Popup>${location.price}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
