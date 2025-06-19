import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const Map = ({ locations = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView([25.2048, 55.2708], 13); // Dubai coordinates

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add markers for locations
      locations.forEach(location => {
        if (location.latitude && location.longitude) {
          L.marker([parseFloat(location.latitude), parseFloat(location.longitude)])
            .addTo(mapInstanceRef.current)
            .bindPopup(location.address || 'Location');
        }
      });

      // Fit bounds if there are locations
      if (locations.length > 0) {
        const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
        if (validLocations.length > 0) {
          const bounds = L.latLngBounds(
            validLocations.map(loc => [parseFloat(loc.latitude), parseFloat(loc.longitude)])
          );
          if (bounds.isValid()) {
            mapInstanceRef.current.fitBounds(bounds);
          }
        }
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '539px',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default Map;
