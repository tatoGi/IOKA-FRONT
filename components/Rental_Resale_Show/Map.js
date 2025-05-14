import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css'; 

// Define the custom marker icon
const customIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,<svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.3409 39C20.2273 33.9844 29.0909 21.8281 29.0909 15C29.0909 6.71875 22.5758 0 14.5455 0C6.51515 0 0 6.71875 0 15C0 21.8281 8.86364 33.9844 12.75 39C13.6818 40.1953 15.4091 40.1953 16.3409 39ZM14.5455 10C15.8314 10 17.0646 10.5268 17.9739 11.4645C18.8831 12.4021 19.3939 13.6739 19.3939 15C19.3939 16.3261 18.8831 17.5979 17.9739 18.5355C17.0646 19.4732 15.8314 20 14.5455 20C13.2596 20 12.0263 19.4732 11.1171 18.5355C10.2078 17.5979 9.69697 16.3261 9.69697 15C9.69697 13.6739 10.2078 12.4021 11.1171 11.4645C12.0263 10.5268 13.2596 10 14.5455 10Z" fill="%230A273B"/>
  </svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
  className: 'custom-marker-icon',
});

const Map = ({ location_link }) => {
  const [position, setPosition] = useState([25.2048, 55.2708]); // Default to Dubai coordinates
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location_link) {
      setError("No location data provided");
      return;
    }

    let extractedLat, extractedLng;

    try {
      // Handle object location data
      if (typeof location_link === 'object' && location_link !== null) {
        if (location_link.lat && location_link.lng) {
          extractedLat = parseFloat(location_link.lat);
          extractedLng = parseFloat(location_link.lng);
        } else if (location_link.latitude && location_link.longitude) {
          extractedLat = parseFloat(location_link.latitude);
          extractedLng = parseFloat(location_link.longitude);
        }
      }
      // Handle string location data
      else if (typeof location_link === 'string') {
        // Handle Google Maps share links
        if (location_link.includes('maps.app.goo.gl')) {
          fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(location_link)}`)
            .then(response => response.json())
            .then(data => {
              const fullUrl = data.contents;
              const match = fullUrl.match(/@([-?\d.]+),([-?\d.]+)/);
              if (match) {
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[2]);
                if (!isNaN(lat) && !isNaN(lng)) {
                  setPosition([lat, lng]);
                } else {
                  setError("Invalid coordinates from resolved URL");
                }
              } else {
                setError("Could not extract coordinates from resolved URL");
              }
            })
            .catch(err => {
              console.error('Error resolving URL:', err);
              setError("Error resolving short URL: " + err.message);
            });
          return;
        }
        // Handle regular Google Maps URLs
        else if (location_link.startsWith('https://www.google.com/maps')) {
          const match = location_link.match(/@([-?\d.]+),([-?\d.]+)/);
          if (match) {
            extractedLat = parseFloat(match[1]);
            extractedLng = parseFloat(match[2]);
          }
        }
        // Handle direct coordinate pairs
        else if (location_link.includes(',')) {
          const [lat, lng] = location_link.split(',').map(Number);
          extractedLat = lat;
          extractedLng = lng;
        }
      }

      // Set position if valid coordinates were extracted
      if (!isNaN(extractedLat) && !isNaN(extractedLng)) {
        setPosition([extractedLat, extractedLng]);
      } else {
        setError("Invalid coordinates");
      }
    } catch (error) {
      console.error('Error processing location data:', error);
      setError("Error processing location data: " + error.message);
    }
  }, [location_link]);

  if (error) {
    return (
      <div className={styles.mapPlaceholder}>
        <div className={styles.errorMessage}>Error: {error}</div>
        <div className={styles.sectionTitleBanner}>
          <span className={styles.sectionTitleBannerText}>Location Map</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapPlaceholder}>
      <MapContainer 
        key={position.toString()} 
        center={position} 
        zoom={13} 
        className={styles.mapContainer}
        style={{ height: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={position} icon={customIcon}>
          <Popup>📍 Property Location</Popup>
        </Marker>
      </MapContainer>
      <div className={styles.sectionTitleBanner}>
        <span className={styles.sectionTitleBannerText}>Location Map</span>
      </div>
    </div>
  );
};

export default Map;