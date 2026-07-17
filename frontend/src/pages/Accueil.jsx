import React from "react";

function Accueil({ statistiques, conseilsCount, loading, user, onNavigate }) {
  const resolvedRate = statistiques.total_signalements
    ? Math.round((statistiques.resolus / statistiques.total_signalements) * 100)
    : 0;

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="badge"><span aria-hidden="true">●</span> Agir pour la propreté</span>
          <h1>Un quartier propre commence par un signalement</h1>
          <p>
            Photographiez, localisez et signalez un dépôt de déchets en quelques instants.
            EcoSignal CI facilite le lien entre citoyens et équipes de collecte.
          </p>
          <div className="actions">
            <button className="primary" onClick={() => onNavigate(user ? "signaler" : "connexion")}>
              Faire un signalement <span aria-hidden="true">→</span>
            </button>
            <button className="secondary" onClick={() => onNavigate("conseils")}>
              Découvrir les bons gestes
            </button>
          </div>
          <div className="hero-reassurance" aria-label="Avantages du service">
            <span>✓ Gratuit</span>
            <span>✓ Simple</span>
            <span>✓ Suivi transparent</span>
          </div>
        </div>

        <figure className="clean-city-visual">
          <img
            src="/images/abidjan-clean-city-hero.webp"
            alt="Boulevard arboré et carrefour propre dans une ville ivoirienne moderne"
          />
          <div className="city-photo-shade" />
          <div className="city-label">
            <span aria-hidden="true">✨</span>
            <div><strong>Ville propre</strong><small>Notre ambition commune</small></div>
          </div>
          <div className="photo-status">
            <span className="live-dot" />
            <div><strong>Espaces valorisés</strong><small>Propres, verts et agréables</small></div>
          </div>
          <figcaption className="sr-only">Vision d’un espace urbain propre, vert et développé.</figcaption>
        </figure>
      </section>

      <section className="impact-strip" aria-label="Impact EcoSignal CI">
        <div><strong>{loading ? "—" : statistiques.total_signalements}</strong><span>signalements reçus</span></div>
        <div><strong>{loading ? "—" : statistiques.resolus}</strong><span>situations résolues</span></div>
        <div><strong>{loading ? "—" : `${resolvedRate}%`}</strong><span>de résolution</span></div>
        <div><strong>{loading ? "—" : conseilsCount}</strong><span>conseils pratiques</span></div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Votre action compte</p>
          <h2>De la rue propre à la ville durable</h2>
          <p>Un parcours simple pour transformer rapidement un problème observé en action concrète.</p>
        </div>
        <div className="cards">
          <article className="card"><span className="step-number">01</span><span className="card-icon">📷</span><h3>Je photographie</h3><p>Une image claire aide les équipes à comprendre immédiatement la situation.</p></article>
          <article className="card"><span className="step-number">02</span><span className="card-icon">📍</span><h3>Je localise</h3><p>J’indique la commune et, si je le souhaite, la position exacte du dépôt.</p></article>
          <article className="card"><span className="step-number">03</span><span className="card-icon">🛻</span><h3>Je suis l’action</h3><p>Je reçois les informations de traitement jusqu’à la collecte des déchets.</p></article>
        </div>
      </section>

      <section className="clean-showcase">
        <div className="showcase-copy">
          <p className="eyebrow">Un réflexe citoyen</p>
          <h2>Préserver notre cadre de vie, ensemble</h2>
          <p>
            Chaque signalement améliore la visibilité des dépôts sauvages et aide à mieux
            organiser les interventions. Un petit geste numérique pour un impact bien réel.
          </p>
          <ul>
            <li><span>✓</span> Des rues plus agréables et plus sûres</li>
            <li><span>✓</span> Une intervention mieux ciblée des équipes</li>
            <li><span>✓</span> Une communauté informée et engagée</li>
          </ul>
        </div>
        <div className="showcase-quote">
          <span className="quote-mark" aria-hidden="true">“</span>
          <blockquote>La propreté de nos quartiers est l’affaire de tous.</blockquote>
          <p>EcoSignal CI rend chaque citoyen acteur du changement.</p>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p className="eyebrow">Passez à l’action</p>
          <h2>Vous avez repéré un dépôt de déchets ?</h2>
          <p>Quelques informations suffisent pour alerter et suivre la prise en charge.</p>
        </div>
        <button className="primary" onClick={() => onNavigate(user ? "signaler" : "connexion")}>
          Signaler maintenant <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}

export default Accueil;
