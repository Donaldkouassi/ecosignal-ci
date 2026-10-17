import React, { useMemo, useState } from "react";
import { CONSEIL_CATEGORIES, CONSEIL_CATEGORY_ICONS } from "../constants/conseils";

function Conseils({ conseils }) {
  const [activeCategory, setActiveCategory] = useState("tous");

  const availableCategories = useMemo(
    () => CONSEIL_CATEGORIES.filter((categorie) => conseils.some((conseil) => conseil.categorie === categorie)),
    [conseils]
  );

  const visibleConseils = activeCategory === "tous"
    ? conseils
    : conseils.filter((conseil) => conseil.categorie === activeCategory);

  return (
    <main className="page">
      <section className="title-box">
        <h1>Conseils écologiques</h1>
        <p>
          Des gestes simples pour la propreté de nos quartiers, les dangers des déchets non collectés,
          et l’action citoyenne au quotidien.
        </p>
      </section>

      {availableCategories.length > 1 && (
        <div className="filter-tabs" aria-label="Filtrer les conseils par catégorie">
          <button
            type="button"
            className={activeCategory === "tous" ? "active" : ""}
            aria-pressed={activeCategory === "tous"}
            onClick={() => setActiveCategory("tous")}
          >
            Tous <span>{conseils.length}</span>
          </button>
          {availableCategories.map((categorie) => (
            <button
              key={categorie}
              type="button"
              className={activeCategory === categorie ? "active" : ""}
              aria-pressed={activeCategory === categorie}
              onClick={() => setActiveCategory(categorie)}
            >
              {categorie} <span>{conseils.filter((c) => c.categorie === categorie).length}</span>
            </button>
          ))}
        </div>
      )}

      {visibleConseils.length === 0 ? (
        <p className="empty-state">Aucun conseil disponible pour cette catégorie.</p>
      ) : (
        <div className="cards stagger">
          {visibleConseils.map((conseil) => (
            <article className="card" key={conseil.id}>
              <span className="card-icon">{CONSEIL_CATEGORY_ICONS[conseil.categorie] || "🌿"}</span>
              <p className="category-tag">{conseil.categorie}</p>
              <h3>{conseil.titre}</h3>
              <p>{conseil.contenu}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Conseils;
