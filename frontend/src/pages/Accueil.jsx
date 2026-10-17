import React from "react";
import BarChart from "../components/charts/BarChart";
import PublicMap from "../components/PublicMap";

function formatJours(value) {
  if (value == null) return "—";
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
}

function Accueil({ statistiques, loading, user, onNavigate }) {
  const signaler = () => onNavigate(user ? "signaler" : "connexion");
  const total = statistiques.total_signalements || 0;
  const collectes = statistiques.collectes_terminees ?? statistiques.resolus ?? 0;
  const taux = statistiques.taux_resolution ?? (total ? Math.round((statistiques.resolus / total) * 100) : 0);

  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <h1>Un dépôt sauvage dans votre rue&nbsp;? Signalez-le en une minute.</h1>
          <p className="home-lead">
            Photo, position et type de déchet&nbsp;: votre signalement arrive directement aux équipes
            de collecte de votre commune, et vous êtes prévenu à chaque étape jusqu'à ce que la rue soit propre.
          </p>
          <div className="home-actions">
            <button className="signal-button" onClick={signaler}>Signaler un dépôt</button>
            <button className="quiet-button" onClick={() => onNavigate("conseils")}>Voir les bons gestes</button>
          </div>
          <p className="home-note">Gratuit, sans application à installer.</p>
        </div>

        <figure className="home-map">
          <PublicMap />
          <figcaption>
            {loading
              ? "Chargement des signalements…"
              : `${total} dépôts signalés à ce jour, dont ${statistiques.resolus || 0} déjà collectés.`}
          </figcaption>
        </figure>
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

      {!loading && statistiques.par_commune?.length > 0 && (
        <section className="home-section home-communes" aria-labelledby="communes-titre">
          <div className="home-communes-text">
            <h2 id="communes-titre">Où les habitants signalent le plus</h2>
            <p>
              Chaque signalement dessine la carte des points noirs. Les mairies s'en servent pour placer
              bacs et équipes là où le besoin est réel.
            </p>
          </div>
          <BarChart
            data={statistiques.par_commune.slice(0, 6).map((item) => ({ label: item.commune, total: item.total }))}
            caption="Nombre de signalements par commune"
          />
        </section>
      )}

      <section className="home-closing">
        <h2>Vous voyez un dépôt en ce moment&nbsp;?</h2>
        <button className="signal-button" onClick={signaler}>Signaler un dépôt</button>
      </section>
    </main>
  );
}

export default Accueil;
