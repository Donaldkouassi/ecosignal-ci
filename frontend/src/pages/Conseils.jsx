import React from "react";

function Conseils({ conseils }) {
  const icon = (categorie = "") => categorie.toLowerCase().includes("tri") ? "♻️" : categorie.toLowerCase().includes("organique") ? "🍃" : "🌿";
  return (
    <main className="page">
      <section className="title-box"><h1>Conseils écologiques</h1><p>Des gestes simples pour réduire les déchets au quotidien.</p></section>
      {conseils.length === 0 ? <p className="empty-state">Aucun conseil disponible.</p> : <div className="cards">{conseils.map((conseil) => <article className="card" key={conseil.id}><span>{icon(conseil.categorie)}</span><p className="category-tag">{conseil.categorie}</p><h3>{conseil.titre}</h3><p>{conseil.contenu}</p></article>)}</div>}
    </main>
  );
}

export default Conseils;
