import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { apiRequest } from "../services/api";

const ABIDJAN = [5.345, -4.02];

export const STATUTS = {
  en_attente: { label: "À traiter", className: "pin-attente" },
  en_cours: { label: "Collecte planifiée", className: "pin-cours" },
  resolu: { label: "Collecté", className: "pin-resolu" },
};

const CATEGORIES = {
  plastique: "Plastique",
  organique: "Organique",
  encombrant: "Encombrant",
  mixte: "Mixte",
  autre: "Autre",
};

function pinIcon(statut, index) {
  const meta = STATUTS[statut] || STATUTS.en_attente;
  return L.divIcon({
    className: "",
    html: `<span class="pin ${meta.className}" style="--i:${index}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

// Cadre la carte sur Abidjan : les points de l'intérieur du pays restent dans la liste,
// mais la vue d'accueil montre la ville où se concentrent les signalements.
function FitAbidjan({ points }) {
  const map = useMap();
  useEffect(() => {
    const abidjan = points.filter((p) => p.latitude > 5.1 && p.latitude < 5.6 && p.longitude > -4.4 && p.longitude < -3.7);
    if (abidjan.length > 1) {
      map.fitBounds(L.latLngBounds(abidjan.map((p) => [p.latitude, p.longitude])), { padding: [28, 28], maxZoom: 13 });
    } else {
      map.setView(ABIDJAN, 12);
    }
  }, [map, points]);
  return null;
}

function PublicMap() {
  const [points, setPoints] = useState([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest("/carte")
      .then((data) => active && setPoints(Array.isArray(data) ? data : []))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  const markers = useMemo(
    () => points.map((point, index) => ({ ...point, icon: pinIcon(point.statut, index) })),
    [points]
  );

  return (
    <div className="public-map">
      <MapContainer center={ABIDJAN} zoom={12} scrollWheelZoom={false} zoomControl={false} attributionControl>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FitAbidjan points={points} />
        {markers.map((point) => (
          <Marker key={point.id} position={[point.latitude, point.longitude]} icon={point.icon}>
            <Popup>
              <div className="map-popup">
                <h4>{point.commune}</h4>
                <p>{CATEGORIES[point.categorie] || "Déchets"} · {(STATUTS[point.statut] || STATUTS.en_attente).label}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <ul className="map-key" aria-label="Légende de la carte">
        {Object.entries(STATUTS).map(([key, meta]) => (
          <li key={key}><span className={`pin ${meta.className}`} aria-hidden="true" />{meta.label}</li>
        ))}
      </ul>

      {failed && <p className="map-fallback">La carte n'a pas pu se charger. Rechargez la page dans un instant.</p>}
    </div>
  );
}

export default PublicMap;
