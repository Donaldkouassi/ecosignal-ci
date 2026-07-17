import React, { useState } from "react";
import SignalementCard from "../components/SignalementCard";

function Dashboard({ signalements, loading, user }) {
  const [activeFilter, setActiveFilter] = useState("tous");
  const count = (status) => signalements.filter((item) => item.statut === status).length;
  const filters = [
    ["tous", "Tous", signalements.length],
    ["en_attente", "En attente", count("en_attente")],
    ["en_cours", "En cours", count("en_cours")],
    ["resolu", "Résolus", count("resolu")],
  ];
  const visibleSignalements = activeFilter === "tous"
    ? signalements
    : signalements.filter((item) => item.statut === activeFilter);

  return (
    <main className="page">
      <section className="title-box">
        <h1>Mes signalements</h1>
        <p>{user.prenom}, suivez ici l’évolution de vos demandes.</p>
      </section>
      <div className="dashboard-stats">
        <div className="stat-card"><strong>{signalements.length}</strong><span>Total affiché</span></div>
        <div className="stat-card"><strong>{count("en_attente")}</strong><span>En attente</span></div>
        <div className="stat-card"><strong>{count("en_cours")}</strong><span>En cours</span></div>
        <div className="stat-card"><strong>{count("resolu")}</strong><span>Résolus</span></div>
      </div>
      <section className="content-panel" aria-labelledby="signalements-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Suivi en temps réel</p>
            <h2 id="signalements-title">Vos demandes</h2>
          </div>
          <div className="filter-tabs" aria-label="Filtrer les signalements">
            {filters.map(([value, label, total]) => (
              <button
                key={value}
                type="button"
                className={activeFilter === value ? "active" : ""}
                aria-pressed={activeFilter === value}
                onClick={() => setActiveFilter(value)}
              >
                {label} <span>{total}</span>
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="skeleton-list" aria-label="Chargement des signalements">
            <span /><span /><span />
          </div>
        ) : visibleSignalements.length === 0 ? (
          <p className="empty-state">
            {signalements.length === 0 ? "Aucun signalement enregistré." : "Aucun résultat pour ce filtre."}
          </p>
        ) : (
          <div className="list">{visibleSignalements.map((item) => <SignalementCard key={item.id} signalement={item} />)}</div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
