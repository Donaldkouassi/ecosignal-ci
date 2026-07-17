import React, { useState } from "react";
import { apiRequest, firstValidationError } from "../services/api";

const initialForm = { commune: "", categorie: "", description: "", photo: null, latitude: "", longitude: "" };

function NouveauSignalement({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function selectPhoto(event) {
    const photo = event.target.files[0] || null;
    if (photo && photo.size > 4 * 1024 * 1024) {
      event.target.value = "";
      setForm((current) => ({ ...current, photo: null }));
      setMessage("La photo ne doit pas dépasser 4 Mo.");
      return;
    }
    setMessage("");
    setForm((current) => ({ ...current, photo }));
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setMessage("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude }));
        setMessage("Position ajoutée au signalement.");
      },
      () => setMessage("La position n’a pas pu être récupérée.")
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") payload.append(key, value);
    });

    try {
      await apiRequest("/signalements", { method: "POST", body: payload });
      setForm(initialForm);
      onCreated();
    } catch (error) {
      setMessage(firstValidationError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <section className="title-box">
        <h1>Nouveau signalement</h1>
        <p>Signalez un dépôt de déchets observé dans votre commune.</p>
      </section>
      <section className="form-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          {message && <p className={`feedback ${message.includes("ajoutée") ? "success-message" : "error"}`}>{message}</p>}
          <label htmlFor="commune">Commune concernée</label>
          <select id="commune" required value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })}>
            <option value="">-- Choisir une commune --</option>
            {['Abobo', 'Cocody', 'Koumassi', 'Marcory', 'Plateau', 'Treichville', 'Yopougon'].map((commune) => <option key={commune}>{commune}</option>)}
          </select>
          <label htmlFor="categorie">Type de déchet</label>
          <select id="categorie" required value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}>
            <option value="">-- Choisir une catégorie --</option>
            <option value="plastique">Plastique</option><option value="organique">Organique</option><option value="encombrant">Encombrant</option><option value="mixte">Mixte</option><option value="autre">Autre</option>
          </select>
          <label htmlFor="description">Description</label>
          <textarea id="description" minLength="10" maxLength="2000" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <small className="field-hint field-counter">{form.description.length}/2000 caractères</small>
          <label htmlFor="photo">Photo facultative</label>
          <input id="photo" type="file" accept="image/png,image/jpeg,image/webp" onChange={selectPhoto} />
          <small className="field-hint">JPG, PNG ou WebP — 4 Mo maximum.</small>
          <button type="button" className="secondary" onClick={locateUser}>Ajouter ma position</button>
          <button className="primary" type="submit" disabled={submitting}>{submitting ? "Envoi..." : "Envoyer le signalement"}</button>
        </form>
        <aside className="help-box"><h3>Conseils de saisie</h3><ul><li>Décrivez précisément le lieu.</li><li>Ajoutez une photo claire si possible.</li><li>La position GPS reste facultative.</li><li>Vous pourrez suivre le traitement depuis votre espace.</li></ul></aside>
      </section>
    </main>
  );
}

export default NouveauSignalement;
