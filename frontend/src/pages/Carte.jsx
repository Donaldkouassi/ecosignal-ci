import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const ABIDJAN_CENTER = [5.3599517, -4.0082563];

const STATUS_META = {
  en_attente: { label: "En attente", color: "var(--status-serious)" },
  en_cours: { label: "En cours", color: "var(--status-warning)" },
  resolu: { label: "Résolu", color: "var(--status-good)" },
};

function markerIcon(statut) {
  const meta = STATUS_META[statut] || STATUS_META.en_attente;
  return L.divIcon({
    className: "",
    html: `<span class="map-marker" style="background:${meta.color}"><span>📍</span></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 24],
    popupAnchor: [0, -22],
  });
}

function FitToMarkers({ points }) {
  const map = useMap();

  React.useEffect(() => {
    if (points.length === 0) {
      map.setView(ABIDJAN_CENTER, 12);
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 14);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [map, points]);

  return null;
}

function Carte({ signalements, loading }) {
  const localises = useMemo(
    () => signalements.filter((item) => item.latitude != null && item.longitude != null),
    [signalements]
  );

  return (
    <main className="page">
      <section className="title-box">
        <h1>Carte des signalements</h1>
        <p>Visualisez la localisation des dépôts signalés et suivez leur statut de traitement.</p>
      </section>

      {loading ? (
        <div className="skeleton-list" aria-label="Chargement de la carte">
          <span />
        </div>
      ) : (
        <div className="map-page-layout">
          <div className="map-container">
            <MapContainer center={ABIDJAN_CENTER} zoom={12} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitToMarkers points={localises} />
              {localises.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                  icon={markerIcon(item.statut)}
                >
                  <Popup>
                    <div className="map-popup">
                      <h4>{item.commune}</h4>
                      <p>
                        {item.categorie?.charAt(0).toUpperCase() + item.categorie?.slice(1)} •{" "}
                        {new Date(item.created_at).toLocaleDateString("fr-FR")}
                      </p>
                      <p>{STATUS_META[item.statut]?.label || item.statut}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <aside className="map-side">
            <div className="map-legend">
              <h3>Légende</h3>
              <ul>
                {Object.values(STATUS_META).map((meta) => (
                  <li key={meta.label}>
                    <span className="legend-dot" style={{ background: meta.color }} aria-hidden="true" />
                    {meta.label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="map-note">
              {localises.length} signalement{localises.length > 1 ? "s" : ""} localisé
              {localises.length > 1 ? "s" : ""} sur {signalements.length} au total. Les signalements sans
              position GPS ne sont pas affichés sur la carte.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Carte;
