import React, { useState } from "react";
import { CONSEIL_CATEGORIES } from "../constants/conseils";

const emptyForm = { titre: "", categorie: "", contenu: "" };

function ConseilForm({ conseil, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    conseil
      ? { titre: conseil.titre, categorie: conseil.categorie, contenu: conseil.contenu }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>{conseil ? "Modifier le conseil" : "Ajouter un conseil"}</h3>
      <label htmlFor="conseil-titre">Titre</label>
      <input
        id="conseil-titre"
        required
        maxLength="255"
        value={form.titre}
        onChange={(e) => setForm({ ...form, titre: e.target.value })}
      />
      <label htmlFor="conseil-categorie">Catégorie</label>
      <select
        id="conseil-categorie"
        required
        value={form.categorie}
        onChange={(e) => setForm({ ...form, categorie: e.target.value })}
      >
        <option value="">-- Choisir une catégorie --</option>
        {CONSEIL_CATEGORIES.map((categorie) => (
          <option key={categorie}>{categorie}</option>
        ))}
      </select>
      <label htmlFor="conseil-contenu">Contenu</label>
      <textarea
        id="conseil-contenu"
        required
        minLength="10"
        maxLength="2000"
        value={form.contenu}
        onChange={(e) => setForm({ ...form, contenu: e.target.value })}
      />
      <div className="action-buttons">
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : conseil ? "Enregistrer" : "Ajouter"}
        </button>
        <button className="secondary" type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default ConseilForm;
