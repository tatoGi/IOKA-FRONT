"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "./Map.module.css";
import "leaflet/dist/leaflet.css";

const Map = ({ locations = [] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Fix for Leaflet's default marker icons
      if (typeof window !== 'undefined') {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/images/marker-icon-2x.png',
          iconUrl: '/images/marker-icon.png',
          shadowUrl: '/images/marker-shadow.png',
        });
      }
      setIsMounted(true);
    } catch (err) {
      console.error("Error initializing map:", err);
      setError(err.message);
    }
  }, []);

  // Custom marker icon style
  const createCustomIcon = (label) => {
    try {
      return L.divIcon({
        className: styles.priceMarker,
        html: `<div>${label}</div>`,
        iconSize: [60, 40],
        iconAnchor: [30, 40]
      });
    } catch (err) {
      console.error("Error creating custom icon:", err);
      return L.divIcon({
        className: styles.priceMarker,
        html: `<div>${label}</div>`,
        iconSize: [60, 40],
        iconAnchor: [30, 40]
      });
    }
  };

  const extractLatLng = (googleMapsLink) => {
    try {
      if (!googleMapsLink) return [0, 0];
      const match = googleMapsLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      return match ? [parseFloat(match[1]), parseFloat(match[2])] : [0, 0];
    } catch (err) {
      console.error("Error extracting coordinates:", err);
      return [0, 0];
    }
  };

  if (error) {
    return <div className={styles.mapWrapper}>Error loading map: {error}</div>;
  }

  if (!isMounted) {
    return <div className={styles.mapWrapper}>Loading map...</div>;
  }

  return (
    <div className={styles.mapWrapper} style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        zoomControl={true}
        zoomControlPosition="topright"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {Array.isArray(locations) && locations.map((location, index) => {
          if (!location || !location.google_maps_link) return null;
          
          const [latitude, longitude] = extractLatLng(location.google_maps_link);
          return (
            <Marker
              key={index}
              position={[latitude, longitude]}
              icon={createCustomIcon(location.label || 'Location')}
            >
              <Popup>{location.label || 'Location'}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
