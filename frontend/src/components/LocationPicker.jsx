import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

const ABIDJAN_CENTER = [5.3599517, -4.0082563];

const markerIcon = L.divIcon({
  className: "",
  html: '<span class="map-marker" style="background:var(--green-700)"><span>📍</span></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 24],
});

function RecenterOnChange({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [map, position]);

  return null;
}

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function LocationPicker({ latitude, longitude, onChange }) {
  const hasPosition = latitude !== "" && latitude != null && longitude !== "" && longitude != null;
  const position = hasPosition ? [Number(latitude), Number(longitude)] : null;

  return (
    <div className="location-picker">
      <MapContainer center={position || ABIDJAN_CENTER} zoom={position ? 15 : 12} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={onChange} />
        <RecenterOnChange position={position} />
        {position && (
          <Marker
            position={position}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const { lat, lng } = event.target.getLatLng();
                onChange(lat, lng);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default LocationPicker;
