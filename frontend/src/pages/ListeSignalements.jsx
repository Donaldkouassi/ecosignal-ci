import React, { useMemo, useState } from "react";
import CollecteForm from "../components/CollecteForm";
import ConseilForm from "../components/ConseilForm";
import SignalementCard from "../components/SignalementCard";
import BarChart from "../components/charts/BarChart";
import StatusBar from "../components/charts/StatusBar";

function ListeSignalements({
  signalements,
  statistiques,
  loading,
  onStatusChange,
  onDelete,
  onPlanCollecte,
  conseils,
  onCreateConseil,
  onUpdateConseil,
  onDeleteConseil,
}) {
  const [selectedSignalement, setSelectedSignalement] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [showConseilForm, setShowConseilForm] = useState(false);
  const [editingConseil, setEditingConseil] = useState(null);
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

  function openConseilCreation() {
    setEditingConseil(null);
    setShowConseilForm(true);
  }

  function openConseilEdition(conseil) {
    setEditingConseil(conseil);
    setShowConseilForm(true);
  }

  function closeConseilForm() {
    setShowConseilForm(false);
    setEditingConseil(null);
  }

  async function submitConseil(payload) {
    const success = editingConseil
      ? await onUpdateConseil(editingConseil.id, payload)
      : await onCreateConseil(payload);
    if (success) closeConseilForm();
  }

  return (
    <main className="page">
      <section className="title-box">
        <h1>Tableau de bord administrateur</h1>
        <p>Gérez les signalements enregistrés, leur statut et les collectes.</p>
      </section>

      <div className="dashboard-stats stagger">
        <div className="stat-card"><strong>{statistiques.total_signalements}</strong><span>Total</span></div>
        <div className="stat-card"><strong>{statistiques.en_attente}</strong><span>En attente</span></div>
        <div className="stat-card"><strong>{statistiques.en_cours}</strong><span>En cours</span></div>
        <div className="stat-card"><strong>{statistiques.resolus}</strong><span>Résolus</span></div>
      </div>

      <div className="dashboard-stats impact-stats" aria-label="Indicateurs d'impact">
        <div className="stat-card impact-card">
          <strong>{statistiques.taux_resolution ?? 0}%</strong>
          <span>Taux de résolution</span>
        </div>
        <div className="stat-card impact-card">
          <strong>{statistiques.delai_moyen_resolution_jours != null
            ? `${statistiques.delai_moyen_resolution_jours.toLocaleString("fr-FR")} j`
            : "—"}</strong>
          <span>Délai moyen de traitement</span>
        </div>
        <div className="stat-card impact-card">
          <strong>{statistiques.collectes_terminees ?? 0}</strong>
          <span>Collectes réalisées</span>
        </div>
      </div>

      {selectedSignalement && (
        <CollecteForm
          signalement={selectedSignalement}
          onSubmit={submitCollecte}
          onCancel={() => setSelectedSignalement(null)}
        />
      )}

      <section className="admin-panel">
        <h2>Statistiques globales</h2>
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Répartition par statut</h3>
            <StatusBar
              enAttente={statistiques.en_attente}
              enCours={statistiques.en_cours}
              resolus={statistiques.resolus}
              caption="Répartition des signalements par statut"
            />
          </div>
          <div className="chart-card">
            <h3>Évolution sur 6 mois</h3>
            <BarChart
              orientation="vertical"
              data={(statistiques.evolution_mensuelle || []).map((item) => ({ label: item.label, total: item.total }))}
              caption="Nombre de signalements créés par mois"
            />
          </div>
          <div className="chart-card">
            <h3>Répartition par commune</h3>
            <BarChart
              data={statistiques.par_commune.map((item) => ({ label: item.commune, total: item.total }))}
              caption="Nombre de signalements par commune"
            />
          </div>
          <div className="chart-card">
            <h3>Répartition par catégorie</h3>
            <BarChart
              data={(statistiques.par_categorie || []).map((item) => ({
                label: item.categorie?.charAt(0).toUpperCase() + item.categorie?.slice(1),
                total: item.total,
              }))}
              caption="Nombre de signalements par catégorie de déchet"
            />
          </div>
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

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Sensibilisation citoyenne</p>
            <h2>Gestion des conseils</h2>
          </div>
          {!showConseilForm && (
            <button className="primary" type="button" onClick={openConseilCreation}>
              Ajouter un conseil
            </button>
          )}
        </div>

        {showConseilForm && (
          <ConseilForm conseil={editingConseil} onSubmit={submitConseil} onCancel={closeConseilForm} />
        )}

        {conseils.length === 0 ? (
          <p className="empty-state">Aucun conseil publié pour le moment.</p>
        ) : (
          <div className="list">
            {conseils.map((conseil) => (
              <article className="signal-card" key={conseil.id}>
                <div>
                  <p className="category-tag">{conseil.categorie}</p>
                  <h3>{conseil.titre}</h3>
                  <p>{conseil.contenu}</p>
                </div>
                <div className="signal-actions">
                  <div className="action-buttons">
                    <button className="small-btn" onClick={() => openConseilEdition(conseil)}>
                      Modifier
                    </button>
                    <button className="small-btn danger" onClick={() => onDeleteConseil(conseil.id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ListeSignalements;
