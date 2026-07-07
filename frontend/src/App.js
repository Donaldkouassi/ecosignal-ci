import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [page, setPage] = useState("accueil");
  const [signalements, setSignalements] = useState([]);
  const [conseils, setConseils] = useState([]);
  const [statistiques, setStatistiques] = useState({
    total_signalements: 0,
    en_attente: 0,
    en_cours: 0,
    resolus: 0,
    par_commune: [],
  });
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    commune: "",
    categorie: "",
    description: "",
  });

  const chargerSignalements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/signalements`);
      const data = await response.json();
      setSignalements(data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      alert("Impossible de charger les signalements depuis Laravel.");
    } finally {
      setLoading(false);
    }
  };

  const chargerConseils = async () => {
    try {
      const response = await fetch(`${API_URL}/conseils`);
      const data = await response.json();
      setConseils(data);
    } catch (error) {
      console.error("Erreur lors du chargement des conseils :", error);
      alert("Impossible de charger les conseils depuis Laravel.");
    }
  };

  const chargerStatistiques = async () => {
    try {
      const response = await fetch(`${API_URL}/statistiques`);
      const data = await response.json();
      setStatistiques(data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error);
    }
  };

  useEffect(() => {
    chargerSignalements();
    chargerConseils();
    chargerStatistiques();
  }, []);

  const ajouterSignalement = async (e) => {
    e.preventDefault();

    if (!form.commune || !form.categorie || !form.description) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signalements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l’enregistrement.");
      }

      setForm({ commune: "", categorie: "", description: "" });
      await chargerSignalements();
      await chargerStatistiques();
      setPage("dashboard");
    } catch (error) {
      console.error(error);
      alert("Le signalement n’a pas pu être enregistré.");
    }
  };

  const modifierStatut = async (id, nouveauStatut) => {
    try {
      const response = await fetch(`${API_URL}/signalements/${id}/statut`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut.");
      }

      await chargerSignalements();
      await chargerStatistiques();
    } catch (error) {
      console.error(error);
      alert("Le statut n’a pas pu être modifié.");
    }
  };

  const supprimerSignalement = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce signalement ?"
    );

    if (!confirmation) return;

    try {
      const response = await fetch(`${API_URL}/signalements/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression.");
      }

      await chargerSignalements();
      await chargerStatistiques();
    } catch (error) {
      console.error(error);
      alert("Le signalement n’a pas pu être supprimé.");
    }
  };

  const afficherStatut = (statut) => {
    if (statut === "en_attente") return "En attente";
    if (statut === "en_cours") return "En cours";
    if (statut === "resolu") return "Résolu";
    return statut;
  };

  const afficherCategorie = (categorie) => {
    if (!categorie) return "";
    return categorie.charAt(0).toUpperCase() + categorie.slice(1);
  };

  const iconeConseil = (categorie) => {
    if (categorie?.toLowerCase().includes("tri")) return "♻️";
    if (categorie?.toLowerCase().includes("organique")) return "🍃";
    if (categorie?.toLowerCase().includes("salubrité")) return "🚯";
    return "🌿";
  };

  return (
    <div className="app">
      <header className="navbar">
        <h2 onClick={() => setPage("accueil")}>🌿 EcoSignal CI</h2>

        <nav>
          <button onClick={() => setPage("accueil")}>Accueil</button>
          <button onClick={() => setPage("signaler")}>Signaler</button>
          <button onClick={() => setPage("dashboard")}>Mes signalements</button>
          <button onClick={() => setPage("conseils")}>Conseils</button>
          <button onClick={() => setPage("admin")}>Admin</button>
          <button onClick={() => setPage("connexion")} className="login">
            Connexion
          </button>
        </nav>
      </header>

      {page === "accueil" && (
        <main>
          <section className="hero">
            <div>
              <span className="badge">Plateforme citoyenne</span>
              <h1>Ensemble pour des quartiers plus propres</h1>
              <p>
                EcoSignal CI permet aux citoyens de signaler les dépôts de
                déchets urbains, de suivre leur traitement et de contribuer à la
                salubrité en Côte d’Ivoire.
              </p>

              <div className="actions">
                <button className="primary" onClick={() => setPage("signaler")}>
                  Signaler un dépôt
                </button>
                <button className="secondary" onClick={() => setPage("conseils")}>
                  Voir les conseils
                </button>
              </div>
            </div>

            <div className="stats-box">
              <h3>Statistiques rapides</h3>
              <div className="stat">
                <strong>{statistiques.total_signalements}</strong>
                <span>Signalements enregistrés</span>
              </div>
              <div className="stat">
                <strong>{conseils.length}</strong>
                <span>Conseils disponibles</span>
              </div>
              <div className="stat">
                <strong>{statistiques.resolus}</strong>
                <span>Signalements résolus</span>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Comment ça marche ?</h2>
            <div className="cards">
              <div className="card">
                <span>📍</span>
                <h3>Signaler</h3>
                <p>Le citoyen indique la commune, la catégorie et le problème.</p>
              </div>
              <div className="card">
                <span>🛻</span>
                <h3>Planifier</h3>
                <p>L’administrateur organise le suivi et les collectes.</p>
              </div>
              <div className="card">
                <span>✅</span>
                <h3>Résoudre</h3>
                <p>Le statut évolue jusqu’à la résolution du signalement.</p>
              </div>
            </div>
          </section>
        </main>
      )}

      {page === "signaler" && (
        <main className="page">
          <section className="title-box">
            <h1>Nouveau signalement</h1>
            <p>Signalez un dépôt de déchets observé dans votre commune.</p>
          </section>

          <section className="form-layout">
            <form className="form-card" onSubmit={ajouterSignalement}>
              <label>Commune concernée</label>
              <select
                value={form.commune}
                onChange={(e) => setForm({ ...form, commune: e.target.value })}
              >
                <option value="">-- Choisir une commune --</option>
                <option value="Cocody">Cocody</option>
                <option value="Yopougon">Yopougon</option>
                <option value="Marcory">Marcory</option>
                <option value="Abobo">Abobo</option>
                <option value="Koumassi">Koumassi</option>
              </select>

              <label>Type de déchet</label>
              <select
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
              >
                <option value="">-- Choisir une catégorie --</option>
                <option value="plastique">Plastique</option>
                <option value="organique">Organique</option>
                <option value="encombrant">Encombrant</option>
                <option value="mixte">Mixte</option>
                <option value="autre">Autre</option>
              </select>

              <label>Description</label>
              <textarea
                placeholder="Décrivez clairement le dépôt observé..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button className="primary" type="submit">
                Envoyer le signalement
              </button>
            </form>

            <aside className="help-box">
              <h3>Conseils de saisie</h3>
              <ul>
                <li>Choisissez la commune concernée.</li>
                <li>Décrivez clairement le dépôt observé.</li>
                <li>Le statut initial sera “En attente”.</li>
                <li>Le signalement sera enregistré dans MySQL.</li>
              </ul>
            </aside>
          </section>
        </main>
      )}

      {page === "dashboard" && (
        <main className="page">
          <section className="title-box">
            <h1>Mes signalements</h1>
            <p>Suivez l’état des dépôts signalés via la plateforme.</p>
          </section>

          <div className="dashboard-stats">
            <div className="stat-card">
              <strong>{signalements.length}</strong>
              <span>Total</span>
            </div>
            <div className="stat-card">
              <strong>
                {signalements.filter((s) => s.statut === "en_attente").length}
              </strong>
              <span>En attente</span>
            </div>
            <div className="stat-card">
              <strong>
                {signalements.filter((s) => s.statut === "en_cours").length}
              </strong>
              <span>En cours</span>
            </div>
            <div className="stat-card">
              <strong>
                {signalements.filter((s) => s.statut === "resolu").length}
              </strong>
              <span>Résolus</span>
            </div>
          </div>

          {loading ? (
            <p>Chargement des signalements...</p>
          ) : (
            <div className="list">
              {signalements.map((s) => (
                <article className="signal-card" key={s.id}>
                  <div>
                    <h3>{s.commune}</h3>
                    <p>{s.description}</p>
                    <small>
                      {afficherCategorie(s.categorie)} •{" "}
                      {new Date(s.created_at).toLocaleDateString("fr-FR")}
                    </small>
                  </div>

                  <div className="signal-actions">
                    <span className={`status ${s.statut}`}>
                      {afficherStatut(s.statut)}
                    </span>

                    <div className="action-buttons">
                      <button
                        className="small-btn"
                        onClick={() => modifierStatut(s.id, "en_cours")}
                      >
                        En cours
                      </button>

                      <button
                        className="small-btn success"
                        onClick={() => modifierStatut(s.id, "resolu")}
                      >
                        Résolu
                      </button>

                      <button
                        className="small-btn danger"
                        onClick={() => supprimerSignalement(s.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {page === "conseils" && (
        <main className="page">
          <section className="title-box">
            <h1>Conseils écologiques</h1>
            <p>
              Des gestes simples issus de la base de données pour réduire les
              déchets au quotidien.
            </p>
          </section>

          <div className="cards">
            {conseils.map((conseil) => (
              <div className="card" key={conseil.id}>
                <span>{iconeConseil(conseil.categorie)}</span>
                <p className="category-tag">{conseil.categorie}</p>
                <h3>{conseil.titre}</h3>
                <p>{conseil.contenu}</p>
              </div>
            ))}
          </div>
        </main>
      )}

      {page === "admin" && (
        <main className="page">
          <section className="title-box">
            <h1>Tableau de bord administrateur</h1>
            <p>
              Visualisez les statistiques globales et le suivi des signalements
              enregistrés dans la base de données.
            </p>
          </section>

          <div className="dashboard-stats">
            <div className="stat-card">
              <strong>{statistiques.total_signalements}</strong>
              <span>Total signalements</span>
            </div>
            <div className="stat-card">
              <strong>{statistiques.en_attente}</strong>
              <span>En attente</span>
            </div>
            <div className="stat-card">
              <strong>{statistiques.en_cours}</strong>
              <span>En cours</span>
            </div>
            <div className="stat-card">
              <strong>{statistiques.resolus}</strong>
              <span>Résolus</span>
            </div>
          </div>

          <section className="admin-panel">
            <h2>Signalements par commune</h2>

            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Commune</th>
                    <th>Nombre de signalements</th>
                  </tr>
                </thead>
                <tbody>
                  {statistiques.par_commune.map((item) => (
                    <tr key={item.commune}>
                      <td>{item.commune}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-panel">
            <h2>Derniers signalements</h2>

            <div className="list">
              {signalements.slice(0, 5).map((s) => (
                <article className="signal-card" key={s.id}>
                  <div>
                    <h3>{s.commune}</h3>
                    <p>{s.description}</p>
                    <small>
                      {afficherCategorie(s.categorie)} •{" "}
                      {new Date(s.created_at).toLocaleDateString("fr-FR")}
                    </small>
                  </div>

                  <span className={`status ${s.statut}`}>
                    {afficherStatut(s.statut)}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}

      {page === "connexion" && (
        <main className="page">
          <section className="auth-card">
            <h1>Connexion</h1>
            <p>Accédez à votre espace citoyen ou administrateur.</p>

            <input type="email" placeholder="Adresse email" />
            <input type="password" placeholder="Mot de passe" />

            <button className="primary" onClick={() => setPage("admin")}>
              Se connecter
            </button>

            <small>Version démonstration : connexion simulée.</small>
          </section>
        </main>
      )}

      <footer className="footer">
        EcoSignal CI — Plateforme de signalement et de gestion des déchets urbains.
      </footer>
    </div>
  );
}

export default App;
