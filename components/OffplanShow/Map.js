import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Create custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow.src,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const Map = ({ address }) => {
  const [position, setPosition] = useState([25.2048, 55.2708]); // Default position (Dubai)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const apiKey = "8efc38f4a7c240ff941d81ee57181875"; // Your Geoapify API key
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            address
          )}&apiKey=${apiKey}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].geometry.coordinates; // Geoapify returns [lng, lat]
          setPosition([lat, lng]); // Update the position state
        } else {
          setError("Geocoding failed: No results found");
        }
      } catch (error) {
        setError("Error fetching coordinates: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "400px", width: "100%", zIndex: "1" }} // Set map dimensions
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup>The Fifth Tower at JVC</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;