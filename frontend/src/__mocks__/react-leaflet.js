import React from "react";

export function MapContainer({ children }) {
  return <div data-testid="map-container">{children}</div>;
}

export function TileLayer() {
  return null;
}

export function Marker({ children }) {
  return <div data-testid="map-marker">{children}</div>;
}

export function Popup({ children }) {
  return <div data-testid="map-popup">{children}</div>;
}

export function useMap() {
  return { setView: () => {}, fitBounds: () => {} };
}
