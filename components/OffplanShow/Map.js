import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import style from "./OffplaneShow.module.css";
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
  shadowAnchor: [12, 41]
});

const Map = ({ position, nearbyPlaces }) => {
  return (
    <MapContainer
      center={position}
      zoom={14}
      className={style.map}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup>The Fifth Tower at JVC</Popup>
      </Marker>
      {nearbyPlaces.map((place, index) => (
        <Marker key={index} position={place.coords} icon={customIcon}>
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
