import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './map.module.css'; 
import pin from '../../assets/img/pinvector.png'; // Ensure this path is correct

// Define the custom marker icon
const customIcon = new L.Icon({
  iconUrl: pin, // Use the imported image directly
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to the marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // Size of the shadow (if applicable)
});

const Map = ({ location_link }) => {
  const [position, setPosition] = useState([51.505, -0.09]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location_link) {
      let extractedLat, extractedLng;
      if (location_link.startsWith('https://www.google.com/maps')) {
        const match = location_link.match(/@([-?\d.]+),([-?\d.]+)/);
        if (match) {
          extractedLat = parseFloat(match[1]);
          extractedLng = parseFloat(match[2]);
        } else {
          setError('Invalid Google Maps URL');
          return;
        }
      } else if (location_link.includes(',')) {
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
        style={{ height: '100%' }} // Ensure the height is set
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={position} icon={customIcon}> {/* Use the custom icon */}
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