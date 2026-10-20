import React, { useEffect, useRef, useState } from "react";
import { storageUrl } from "../../services/api";
import { CATEGORIES, STATUTS } from "../PublicMap";

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function joursDepuis(value) {
  if (!value) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000));
}

// Panneau latéral : tout ce qu'il faut pour traiter un signalement sans quitter le tableau de bord.
function SignalementDrawer({ signalement, onClose, onPlanCollecte, onStatusChange, onDelete }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [form, setForm] = useState({ date_passage: tomorrow, equipe_assignee: "" });
  const [busy, setBusy] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    setForm({ date_passage: tomorrow, equipe_assignee: "" });
    closeRef.current?.focus();
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalement?.id]);

  if (!signalement) return null;

  const statut = STATUTS[signalement.statut] || STATUTS.en_attente;
  const collecte = signalement.collecte;
  const auteur = signalement.user ? `${signalement.user.prenom} ${signalement.user.nom}` : "Habitant";

  async function run(action) {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="drawer-layer" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer-head">
          <div>
            <span className={`status-chip ${statut.className}`}>{statut.label}</span>
            <h2 id="drawer-title">{signalement.commune}</h2>
            <p className="muted">
              {CATEGORIES[signalement.categorie] || "Déchets"}, signalé le {formatDate(signalement.created_at)} par {auteur}
            </p>
          </div>
          <button ref={closeRef} type="button" className="drawer-close" onClick={onClose} aria-label="Fermer le détail">✕</button>
        </header>

        {signalement.photo_path && (
          <img className="drawer-photo" src={storageUrl(signalement.photo_path)} alt={`Déchets signalés à ${signalement.commune}`} />
        )}

        <section className="drawer-section">
          <h3>Description</h3>
          <p>{signalement.description}</p>
          {signalement.latitude && (
            <p className="muted small">
              Position : {Number(signalement.latitude).toFixed(4)}, {Number(signalement.longitude).toFixed(4)}{" "}
              <a href={`https://www.openstreetmap.org/?mlat=${signalement.latitude}&mlon=${signalement.longitude}#map=17/${signalement.latitude}/${signalement.longitude}`} target="_blank" rel="noreferrer">
                Ouvrir la carte
              </a>
            </p>
          )}
        </section>

        <section className="drawer-section">
          <h3>Collecte</h3>
          {collecte ? (
            <p>
              Passage {collecte.statut === "terminee" ? "effectué" : "prévu"} le {formatDate(collecte.date_passage)} par <strong>{collecte.equipe_assignee}</strong>.
            </p>
          ) : (
            <form
              className="drawer-form"
              onSubmit={(e) => {
                e.preventDefault();
                run(() => onPlanCollecte({ signalement_id: signalement.id, ...form }));
              }}
            >
              <p className="muted">Aucune collecte planifiée. L'habitant sera prévenu dès la planification.</p>
              <label htmlFor="drawer-date">Date de passage</label>
              <input id="drawer-date" type="date" min={tomorrow} required value={form.date_passage} onChange={(e) => setForm({ ...form, date_passage: e.target.value })} />
              <label htmlFor="drawer-equipe">Équipe assignée</label>
              <input id="drawer-equipe" required maxLength="150" placeholder="Ex. Équipe pré-collecte Abobo" value={form.equipe_assignee} onChange={(e) => setForm({ ...form, equipe_assignee: e.target.value })} />
              <button className="primary" type="submit" disabled={busy}>{busy ? "Planification…" : "Planifier la collecte"}</button>
            </form>
          )}
        </section>

        <footer className="drawer-actions">
          {signalement.statut !== "resolu" && (
            <button type="button" className="secondary" disabled={busy} onClick={() => run(() => onStatusChange(signalement.id, "resolu"))}>
              Marquer comme collecté
            </button>
          )}
          {signalement.statut === "resolu" && (
            <button type="button" className="secondary" disabled={busy} onClick={() => run(() => onStatusChange(signalement.id, "en_cours"))}>
              Rouvrir le signalement
            </button>
          )}
          <button type="button" className="text-danger" disabled={busy} onClick={() => run(() => onDelete(signalement.id))}>
            Supprimer
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default SignalementDrawer;
