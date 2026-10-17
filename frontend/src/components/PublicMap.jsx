import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const ABIDJAN = [5.345, -4.02];

export const STATUTS = {
  en_attente: { label: "À traiter", className: "pin-attente" },
  en_cours: { label: "Collecte planifiée", className: "pin-cours" },
  resolu: { label: "Collecté", className: "pin-resolu" },
};

export const CATEGORIES = {
  plastique: "Plastique",
  organique: "Organique",
  encombrant: "Encombrant",
  mixte: "Mixte",
  autre: "Autre",
};

function inAbidjan(p) {
  return p.latitude > 5.1 && p.latitude < 5.6 && p.longitude > -4.4 && p.longitude < -3.7;
}

function pinIcon(statut, index, highlighted) {
  const meta = STATUTS[statut] || STATUTS.en_attente;
  return L.divIcon({
    className: "",
    html: `<span class="pin ${meta.className}${highlighted ? " pin-focus" : ""}" style="--i:${index}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

// Recadre la carte quand la commune choisie change : vue d'ensemble d'Abidjan
// par défaut, zoom animé sur les dépôts d'une commune quand elle est sélectionnée.
function Cadrage({ points, commune }) {
  const map = useMap();
  useEffect(() => {
    const cible = commune ? points.filter((p) => p.commune === commune) : points.filter(inAbidjan);
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const options = { padding: [40, 40], maxZoom: commune ? 15 : 13, animate: !reduceMotion, duration: 0.9 };
    if (cible.length > 1) {
      map.flyToBounds(L.latLngBounds(cible.map((p) => [p.latitude, p.longitude])), options);
    } else if (cible.length === 1) {
      map.flyTo([cible[0].latitude, cible[0].longitude], 15, options);
    } else {
      map.setView(ABIDJAN, 12);
    }
  }, [map, points, commune]);
  return null;
}

function PublicMap({ points, visibleStatuts, commune, onSelectCommune, height }) {
  const markers = useMemo(
    () =>
      points
        .filter((p) => visibleStatuts.includes(p.statut))
        .map((p, index) => ({ ...p, icon: pinIcon(p.statut, index, commune && p.commune === commune) })),
    [points, visibleStatuts, commune]
  );

  return (
    <div className="public-map" style={height ? { height } : undefined}>
      <MapContainer center={ABIDJAN} zoom={12} scrollWheelZoom={false} attributionControl>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Cadrage points={points} commune={commune} />
        {markers.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={point.icon}
            eventHandlers={{ click: () => onSelectCommune?.(point.commune) }}
          >
            <Popup>
              <div className="map-popup">
                <h4>{point.commune}</h4>
                <p>{CATEGORIES[point.categorie] || "Déchets"}, {(STATUTS[point.statut] || STATUTS.en_attente).label.toLowerCase()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default PublicMap;
