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
  iconSize: [30, 40], // Match the SVG dimensions
  iconAnchor: [15, 40], // Center horizontally, bottom vertically
  popupAnchor: [0, -40], // Popup appears above the marker
  className: 'custom-marker-icon',
});

const Map = ({ location_link }) => {
 
  const [position, setPosition] = useState([51.505, -0.09]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location_link) {
      let extractedLat, extractedLng;
      
      // Handle Google Maps share links
      if (location_link.includes('maps.app.goo.gl')) {
        console.log('Processing maps.app.goo.gl link');
        
        // Use a CORS proxy to resolve the short URL
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(location_link)}`)
          .then(response => response.json())
          .then(data => {
            console.log('Resolved URL data:', data);
            
            // Extract the full URL from the response
            const fullUrl = data.contents;
            console.log('Full URL:', fullUrl);
            
            // Extract coordinates from the full URL
            const match = fullUrl.match(/@([-?\d.]+),([-?\d.]+)/);
            if (match) {
              extractedLat = parseFloat(match[1]);
              extractedLng = parseFloat(match[2]);
              console.log('Extracted coordinates:', extractedLat, extractedLng);
              
              if (!isNaN(extractedLat) && !isNaN(extractedLng)) {
                setPosition([extractedLat, extractedLng]);
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
        } else {
          setError('Invalid Google Maps URL');
          return;
        }
      } 
      // Handle direct coordinate pairs
      else if (location_link.includes(',')) {
        const [lat, lng] = location_link.split(',').map(Number);
        extractedLat = lat;
        extractedLng = lng;
      }

      if (!isNaN(extractedLat) && !isNaN(extractedLng)) {
        setPosition([extractedLat, extractedLng]);
      } else {
        setError("Invalid coordinates");
      }
    }
  }, [location_link]);

  if (error) return <div className="text-red-500">Error: {error}</div>;

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
        <span className={styles.sectionTitleBannerText}>
          Location Map
        </span>
      </div>
    </div>
  );
};

export default Map;