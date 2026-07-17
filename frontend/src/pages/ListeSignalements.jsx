import React, { useMemo, useState } from "react";
import CollecteForm from "../components/CollecteForm";
import SignalementCard from "../components/SignalementCard";

function ListeSignalements({ signalements, statistiques, loading, onStatusChange, onDelete, onPlanCollecte }) {
  const [selectedSignalement, setSelectedSignalement] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const visibleSignalements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return signalements.filter((item) => {
      const matchesStatus = statusFilter === "tous" || item.statut === statusFilter;
      const searchableText = `${item.commune} ${item.categorie} ${item.description}`.toLowerCase();
      return matchesStatus && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [query, signalements, statusFilter]);

  async function submitCollecte(payload) {
    const created = await onPlanCollecte(payload);
    if (created) setSelectedSignalement(null);
  }

  return (
    <main className="page">
      <section className="title-box">
        <h1>Tableau de bord administrateur</h1>
        <p>Gérez les signalements enregistrés, leur statut et les collectes.</p>
      </section>

      <div className="dashboard-stats">
        <div className="stat-card"><strong>{statistiques.total_signalements}</strong><span>Total</span></div>
        <div className="stat-card"><strong>{statistiques.en_attente}</strong><span>En attente</span></div>
        <div className="stat-card"><strong>{statistiques.en_cours}</strong><span>En cours</span></div>
        <div className="stat-card"><strong>{statistiques.resolus}</strong><span>Résolus</span></div>
      </div>

      {selectedSignalement && (
        <CollecteForm
          signalement={selectedSignalement}
          onSubmit={submitCollecte}
          onCancel={() => setSelectedSignalement(null)}
        />
      )}

      <section className="admin-panel">
        <h2>Répartition par commune</h2>
        <div className="admin-table">
          <table>
            <thead><tr><th>Commune</th><th>Nombre</th></tr></thead>
            <tbody>{statistiques.par_commune.map((item) => <tr key={item.commune}><td>{item.commune}</td><td>{item.total}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Gestion opérationnelle</p>
            <h2>Signalements récents</h2>
          </div>
          <span className="result-count">{visibleSignalements.length} résultat{visibleSignalements.length > 1 ? "s" : ""}</span>
        </div>
        <div className="toolbar">
          <label className="search-field">
            <span className="sr-only">Rechercher un signalement</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Commune, catégorie ou description..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="status-filter">
            <span className="sr-only">Filtrer par statut</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolus</option>
            </select>
          </label>
        </div>
        {loading ? (
          <div className="skeleton-list" aria-label="Chargement des signalements"><span /><span /><span /></div>
        ) : visibleSignalements.length === 0 ? (
          <p className="empty-state">{signalements.length === 0 ? "Aucun signalement disponible." : "Aucun signalement ne correspond à votre recherche."}</p>
        ) : (
          <div className="list">
            {visibleSignalements.map((item) => (
              <SignalementCard
                key={item.id}
                signalement={item}
                isAdmin
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onPlanCollecte={setSelectedSignalement}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ListeSignalements;
