import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PublicMap, { CATEGORIES, STATUTS } from "../components/PublicMap";
import { apiRequest } from "../services/api";

function formatJours(value) {
  if (value == null) return "—";
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
}

function pluriel(n, singulier, pluriel) {
  return `${n} ${n > 1 ? pluriel : singulier}`;
}

// Fait défiler les derniers signalements dans la vignette « En direct » du bandeau.
function useRotation(length, delay = 3800) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (length < 2) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % length), delay);
    return () => window.clearInterval(timer);
  }, [length, delay]);
  return length ? index % length : 0;
}

function Accueil({ statistiques, loading, user, onNavigate }) {
  const signaler = () => onNavigate(user ? "signaler" : "connexion");
  const [points, setPoints] = useState([]);
  const [carteIndisponible, setCarteIndisponible] = useState(false);
  const [commune, setCommune] = useState(null);
  const [visibleStatuts, setVisibleStatuts] = useState(Object.keys(STATUTS));
  const [toutesCommunes, setToutesCommunes] = useState(false);
  const LIMITE_COMMUNES = 6;
  const actionsRef = useRef(null);
  const [actionsHorsEcran, setActionsHorsEcran] = useState(false);

  // Le bouton fixe en bas d'écran (mobile) n'apparaît qu'une fois celui du bandeau dépassé.
  useEffect(() => {
    const node = actionsRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setActionsHorsEcran(!entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/carte")
      .then((data) => active && setPoints(Array.isArray(data) ? data : []))
      .catch(() => active && setCarteIndisponible(true));
    return () => {
      active = false;
    };
  }, []);

  const derniers = points.slice(0, 6);
  const rotation = useRotation(derniers.length);
  const enDirect = derniers[rotation];

  const communes = useMemo(() => {
    const parCommune = {};
    points.forEach((p) => {
      const c = (parCommune[p.commune] ||= { nom: p.commune, total: 0, en_attente: 0, en_cours: 0, resolu: 0 });
      c.total += 1;
      c[p.statut] = (c[p.statut] || 0) + 1;
    });
    return Object.values(parCommune).sort((a, b) => b.total - a.total || a.nom.localeCompare(b.nom));
  }, [points]);

  const communeChoisie = communes.find((c) => c.nom === commune);
  const total = statistiques.total_signalements || 0;
  const collectes = statistiques.collectes_terminees ?? statistiques.resolus ?? 0;
  const taux = statistiques.taux_resolution ?? (total ? Math.round((statistiques.resolus / total) * 100) : 0);

  const basculerStatut = (statut) =>
    setVisibleStatuts((actuels) =>
      actuels.includes(statut)
        ? actuels.length > 1 ? actuels.filter((s) => s !== statut) : actuels
        : [...actuels, statut]
    );

  return (
    <main className="home">
      <section className="home-hero">
        <img
          className="home-hero-photo"
          src="/images/abidjan-clean-city-hero.webp"
          alt="Boulevard arboré et propre dans un quartier d'Abidjan"
        />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1>Ville propre, commune propre.</h1>
            <p className="home-lead">
              Des déchets abandonnés dans votre rue&nbsp;? Signalez-les en une minute, avec une photo et leur position.
              Les équipes de collecte de votre commune sont prévenues, et vous êtes informé jusqu'à ce que la rue soit propre.
            </p>
            <div className="home-actions" ref={actionsRef}>
              <button className="signal-button" onClick={signaler}>Signaler un dépôt</button>
              <a className="hero-link" href="#carte">Explorer la carte des dépôts</a>
            </div>
          </div>

          {enDirect && (
            <aside className="live-card" aria-label="Derniers signalements">
              <p className="live-title"><span className="live-dot" aria-hidden="true" /> En direct</p>
              <div className="live-item" key={enDirect.id} aria-live="polite">
                <strong>{enDirect.commune}</strong>
                <span>
                  {CATEGORIES[enDirect.categorie] || "Déchets"}
                  <span className={`live-status ${STATUTS[enDirect.statut]?.className || ""}`}>
                    {STATUTS[enDirect.statut]?.label}
                  </span>
                </span>
              </div>
            </aside>
          )}
        </div>
      </section>

      <section className="home-figures" aria-label="Le service en chiffres">
        <div className="figure">
          <strong>{loading ? "—" : collectes}</strong>
          <span>dépôts collectés après un signalement</span>
        </div>
        <div className="figure">
          <strong>{loading ? "—" : `${formatJours(statistiques.delai_moyen_resolution_jours)} jours`}</strong>
          <span>en moyenne entre le signalement et la collecte</span>
        </div>
        <div className="figure">
          <strong>{loading ? "—" : `${taux} %`}</strong>
          <span>des signalements déjà résolus</span>
        </div>
      </section>

      <section className="home-section explorer" id="carte" aria-labelledby="carte-titre">
        <div className="explorer-head">
          <h2 id="carte-titre">La carte des dépôts, commune par commune</h2>
          <p>Choisissez une commune pour voir où en sont ses signalements. Chaque point est un dépôt signalé par un habitant.</p>
        </div>

        <div className="explorer-body">
          <div className="explorer-panel">
            <div className="status-toggles" role="group" aria-label="Afficher sur la carte">
              {Object.entries(STATUTS).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  className="status-toggle"
                  aria-pressed={visibleStatuts.includes(key)}
                  onClick={() => basculerStatut(key)}
                >
                  <span className={`pin ${meta.className}`} aria-hidden="true" />
                  {meta.label}
                </button>
              ))}
            </div>

            <div className="commune-detail" aria-live="polite">
              {communeChoisie ? (
                <>
                  <h3>{communeChoisie.nom}</h3>
                  <p>
                    {pluriel(communeChoisie.total, "dépôt signalé", "dépôts signalés")}, dont {communeChoisie.resolu || 0} collecté
                    {(communeChoisie.resolu || 0) > 1 ? "s" : ""} et {communeChoisie.en_attente || 0} à traiter.
                  </p>
                  <button type="button" className="text-link" onClick={() => setCommune(null)}>
                    Revenir à tout Abidjan
                  </button>
                </>
              ) : (
                <>
                  <h3>Tout le district</h3>
                  <p>{pluriel(points.length, "dépôt localisé", "dépôts localisés")} sur la carte.</p>
                </>
              )}
            </div>

            <ul className="commune-list" aria-label="Communes">
              {communes.map((c, index) => (
                <li key={c.nom} className={!toutesCommunes && index >= LIMITE_COMMUNES && commune !== c.nom ? "is-extra" : undefined}>
                  <button
                    type="button"
                    className="commune-button"
                    aria-pressed={commune === c.nom}
                    onClick={() => setCommune(commune === c.nom ? null : c.nom)}
                  >
                    <span>{c.nom}</span>
                    <span className="commune-bar" aria-hidden="true">
                      <span style={{ width: `${(c.resolu / c.total) * 100}%` }} />
                    </span>
                    <span className="commune-count">{c.total}</span>
                  </button>
                </li>
              ))}
            </ul>
            {communes.length > LIMITE_COMMUNES && (
              <button type="button" className="text-link more-communes" onClick={() => setToutesCommunes((v) => !v)}>
                {toutesCommunes ? "Afficher moins de communes" : `Voir les ${communes.length - LIMITE_COMMUNES} autres communes`}
              </button>
            )}
            {communes.length > 0 && (
              <p className="commune-legend">La barre verte indique la part des dépôts déjà collectés.</p>
            )}
          </div>

          <div className="explorer-map">
            <PublicMap
              points={points}
              visibleStatuts={visibleStatuts}
              commune={commune}
              onSelectCommune={setCommune}
            />
            {carteIndisponible && (
              <p className="map-fallback">La carte n'a pas pu se charger. Rechargez la page dans un instant.</p>
            )}
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="etapes-titre">
        <h2 id="etapes-titre">Du signalement à la collecte</h2>
        <ol className="process">
          <li>
            <h3>Vous signalez</h3>
            <p>Photo, position GPS et type de déchet, depuis votre téléphone.</p>
          </li>
          <li>
            <h3>La collecte est planifiée</h3>
            <p>Le gestionnaire voit le dépôt sur la carte et programme le passage d'une équipe.</p>
          </li>
          <li>
            <h3>Vous êtes prévenu</h3>
            <p>Une notification vous donne la date de passage, puis confirme la collecte.</p>
          </li>
        </ol>
      </section>

      {createPortal(
        <div className={`mobile-cta${actionsHorsEcran ? " is-visible" : ""}`} aria-hidden={!actionsHorsEcran}>
          <button className="signal-button" onClick={signaler} tabIndex={actionsHorsEcran ? 0 : -1}>Signaler un dépôt</button>
        </div>,
        document.body
      )}

      <section className="home-closing">
        <h2>Vous voyez un dépôt en ce moment&nbsp;?</h2>
        <button className="signal-button" onClick={signaler}>Signaler un dépôt</button>
      </section>
    </main>
  );
}

export default Accueil;
