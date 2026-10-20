import React, { useMemo, useRef, useState } from "react";
import ConseilForm from "../components/ConseilForm";
import PublicMap, { CATEGORIES, STATUTS } from "../components/PublicMap";
import SignalementDrawer, { formatDate, joursDepuis } from "../components/admin/SignalementDrawer";
import { MonthlyChart, ProgressBars } from "../components/admin/charts";

const TOUS = Object.keys(STATUTS);

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
  const [statut, setStatut] = useState(null);
  const [commune, setCommune] = useState(null);
  const [query, setQuery] = useState("");
  const [tri, setTri] = useState("recents");
  const [selectedId, setSelectedId] = useState(null);
  const [showConseilForm, setShowConseilForm] = useState(false);
  const [editingConseil, setEditingConseil] = useState(null);
  const [tousConseils, setTousConseils] = useState(false);
  const tableRef = useRef(null);

  const selected = signalements.find((s) => s.id === selectedId) || null;

  const enAttente = useMemo(
    () => signalements.filter((s) => s.statut === "en_attente").sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    [signalements]
  );
  const enRetard = enAttente.filter((s) => joursDepuis(s.created_at) > 7).length;

  const points = useMemo(
    () =>
      signalements
        .filter((s) => s.latitude != null && s.longitude != null)
        .map((s) => ({ ...s, latitude: Number(s.latitude), longitude: Number(s.longitude) })),
    [signalements]
  );

  const parCommune = useMemo(() => {
    const map = {};
    signalements.forEach((s) => {
      const c = (map[s.commune] ||= { label: s.commune, total: 0, done: 0 });
      c.total += 1;
      if (s.statut === "resolu") c.done += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 6);
  }, [signalements]);

  const parType = (statistiques.par_categorie || []).map((c) => ({
    label: CATEGORIES[c.categorie] || c.categorie,
    total: c.total,
  }));

  const lignes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = signalements.filter((s) => {
      if (statut && s.statut !== statut) return false;
      if (commune && s.commune !== commune) return false;
      if (!q) return true;
      return `${s.commune} ${s.categorie} ${s.description}`.toLowerCase().includes(q);
    });
    return filtered.sort((a, b) =>
      tri === "anciens" ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at)
    );
  }, [signalements, statut, commune, query, tri]);

  function filtrerStatut(valeur) {
    setStatut((actuel) => (actuel === valeur ? null : valeur));
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function planifier(payload) {
    return onPlanCollecte(payload);
  }

  async function supprimer(id) {
    await onDelete(id);
    setSelectedId(null);
  }

  function openConseilCreation() {
    setEditingConseil(null);
    setShowConseilForm(true);
  }

  function closeConseilForm() {
    setShowConseilForm(false);
    setEditingConseil(null);
  }

  async function submitConseil(payload) {
    const success = editingConseil ? await onUpdateConseil(editingConseil.id, payload) : await onCreateConseil(payload);
    if (success) closeConseilForm();
  }

  const delai = statistiques.delai_moyen_resolution_jours;
  const filtresActifs = statut || commune || query;

  return (
    <main className="page admin">
      <header className="admin-head">
        <div>
          <h1>Tableau de bord</h1>
          <p className="muted">Suivi des signalements et des collectes, mis à jour à chaque action.</p>
        </div>
      </header>

      <section className="kpis" aria-label="Indicateurs clés">
        <button type="button" className="kpi kpi-alerte" aria-pressed={statut === "en_attente"} onClick={() => filtrerStatut("en_attente")}>
          <span className="kpi-label"><i className="pin pin-attente" aria-hidden="true" />À traiter</span>
          <strong>{statistiques.en_attente}</strong>
          <span className="kpi-note">{enRetard > 0 ? `dont ${enRetard} depuis plus de 7 jours` : "aucun retard"}</span>
        </button>
        <button type="button" className="kpi" aria-pressed={statut === "en_cours"} onClick={() => filtrerStatut("en_cours")}>
          <span className="kpi-label"><i className="pin pin-cours" aria-hidden="true" />Collectes planifiées</span>
          <strong>{statistiques.en_cours}</strong>
          <span className="kpi-note">en attente de passage</span>
        </button>
        <button type="button" className="kpi" aria-pressed={statut === "resolu"} onClick={() => filtrerStatut("resolu")}>
          <span className="kpi-label"><i className="pin pin-resolu" aria-hidden="true" />Collectés</span>
          <strong>{statistiques.resolus}</strong>
          <span className="kpi-note">sur {statistiques.total_signalements} signalements</span>
        </button>
        <div className="kpi kpi-static">
          <span className="kpi-label">Taux de résolution</span>
          <strong>{statistiques.taux_resolution ?? 0} %</strong>
          <span className="kpi-meter" aria-hidden="true"><span style={{ width: `${statistiques.taux_resolution ?? 0}%` }} /></span>
        </div>
        <div className="kpi kpi-static">
          <span className="kpi-label">Délai moyen de traitement</span>
          <strong>{delai != null ? `${delai.toLocaleString("fr-FR")} j` : "—"}</strong>
          <span className="kpi-note">du signalement à la collecte</span>
        </div>
      </section>

      <section className="admin-grid">
        <div className="panel panel-map">
          <div className="panel-title">
            <h2>Carte des signalements</h2>
            {commune ? (
              <button type="button" className="chip-reset" onClick={() => setCommune(null)}>{commune} ✕</button>
            ) : (
              <span className="muted small map-hint">Cliquez sur un point pour filtrer sa commune</span>
            )}
          </div>
          <PublicMap
            points={points}
            visibleStatuts={statut ? [statut] : TOUS}
            commune={commune}
            onSelectCommune={setCommune}
          />
        </div>

        <div className="panel panel-queue">
          <div className="panel-title">
            <h2>À traiter en priorité</h2>
            <span className="count-badge">{enAttente.length}</span>
          </div>
          {enAttente.length === 0 ? (
            <p className="empty-note">Aucun signalement en attente. Toutes les collectes sont planifiées.</p>
          ) : (
            <ol className="queue">
              {enAttente.slice(0, 6).map((s) => {
                const jours = joursDepuis(s.created_at);
                return (
                  <li key={s.id}>
                    <button type="button" className="queue-item" onClick={() => setSelectedId(s.id)}>
                      <span className="queue-main">
                        <strong>{s.commune}</strong>
                        <span className="muted">{CATEGORIES[s.categorie] || "Déchets"}</span>
                      </span>
                      <span className={`age${jours > 7 ? " age-late" : ""}`}>
                        {jours === 0 ? "aujourd'hui" : `${jours} j`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
          {enAttente.length > 6 && (
            <button type="button" className="text-link" onClick={() => filtrerStatut("en_attente")}>
              Voir les {enAttente.length} signalements à traiter
            </button>
          )}
        </div>

        <div className="panel panel-trend">
          <div className="panel-title"><h2>Signalés et collectés, par mois</h2></div>
          <MonthlyChart data={statistiques.evolution_mensuelle || []} />
        </div>

        <div className="panel panel-communes">
          <div className="panel-title"><h2>Par commune</h2></div>
          <ProgressBars rows={parCommune} onSelect={setCommune} selected={commune} />
          <p className="muted small">La partie verte correspond aux déchets déjà collectés. Cliquez pour filtrer.</p>
        </div>

        <div className="panel panel-types">
          <div className="panel-title"><h2>Par type de déchet</h2></div>
          <ProgressBars rows={parType} />
        </div>
      </section>

      <section className="panel panel-table" ref={tableRef} aria-labelledby="table-title">
        <div className="panel-title">
          <h2 id="table-title">Tous les signalements</h2>
          <span className="muted small">{lignes.length} affiché{lignes.length > 1 ? "s" : ""}</span>
        </div>

        <div className="table-tools">
          <input
            type="search"
            className="table-search"
            placeholder="Rechercher une commune, un type, une description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un signalement"
          />
          <div className="segmented" role="group" aria-label="Filtrer par statut">
            <button type="button" aria-pressed={!statut} onClick={() => setStatut(null)}>Tous</button>
            {Object.entries(STATUTS).map(([key, meta]) => (
              <button key={key} type="button" aria-pressed={statut === key} onClick={() => setStatut(key)}>{meta.label}</button>
            ))}
          </div>
          <select value={tri} onChange={(e) => setTri(e.target.value)} aria-label="Trier les signalements">
            <option value="recents">Plus récents d'abord</option>
            <option value="anciens">Plus anciens d'abord</option>
          </select>
          {filtresActifs && (
            <button type="button" className="text-link" onClick={() => { setStatut(null); setCommune(null); setQuery(""); }}>
              Effacer les filtres
            </button>
          )}
        </div>

        {loading ? (
          <div className="skeleton-list" aria-label="Chargement des signalements"><span /><span /><span /></div>
        ) : lignes.length === 0 ? (
          <p className="empty-note">Aucun signalement ne correspond à ces filtres.</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Commune</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="col-desc">Description</th>
                  <th scope="col">Signalé le</th>
                  <th scope="col">Statut</th>
                  <th scope="col">Collecte</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((s) => {
                  const meta = STATUTS[s.statut] || STATUTS.en_attente;
                  return (
                    <tr key={s.id} className={selectedId === s.id ? "is-selected" : undefined} onClick={() => setSelectedId(s.id)}>
                      <td>
                        <button type="button" className="row-open" onClick={(e) => { e.stopPropagation(); setSelectedId(s.id); }}>
                          {s.commune}
                        </button>
                      </td>
                      <td>{CATEGORIES[s.categorie] || s.categorie}</td>
                      <td className="col-desc">{s.description}</td>
                      <td className="nowrap">{formatDate(s.created_at)}</td>
                      <td><span className={`status-chip ${meta.className}`}>{meta.label}</span></td>
                      <td className="nowrap">
                        {s.collecte ? formatDate(s.collecte.date_passage) : <span className="muted">À planifier</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="conseils-title">
        <div className="panel-title">
          <h2 id="conseils-title">Conseils publiés</h2>
          {!showConseilForm && (
            <button className="primary" type="button" onClick={openConseilCreation}>Ajouter un conseil</button>
          )}
        </div>

        {showConseilForm && <ConseilForm conseil={editingConseil} onSubmit={submitConseil} onCancel={closeConseilForm} />}

        {conseils.length === 0 ? (
          <p className="empty-note">Aucun conseil publié pour le moment.</p>
        ) : (
          <ul className="conseil-list">
            {(tousConseils ? conseils : conseils.slice(0, 4)).map((conseil) => (
              <li key={conseil.id}>
                <div>
                  <span className="pill">{conseil.categorie}</span>
                  <h3>{conseil.titre}</h3>
                  <p className="muted">{conseil.contenu}</p>
                </div>
                <div className="conseil-actions">
                  <button className="small-btn" onClick={() => { setEditingConseil(conseil); setShowConseilForm(true); }}>Modifier</button>
                  <button className="small-btn danger" onClick={() => onDeleteConseil(conseil.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {conseils.length > 4 && (
          <button type="button" className="text-link" onClick={() => setTousConseils((v) => !v)}>
            {tousConseils ? "Afficher moins de conseils" : `Voir les ${conseils.length} conseils`}
          </button>
        )}
      </section>

      <SignalementDrawer
        signalement={selected}
        onClose={() => setSelectedId(null)}
        onPlanCollecte={planifier}
        onStatusChange={onStatusChange}
        onDelete={supprimer}
      />
    </main>
  );
}

export default ListeSignalements;
