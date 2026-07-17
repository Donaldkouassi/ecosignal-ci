import React, { useState } from "react";

function CollecteForm({ signalement, onSubmit, onCancel }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [form, setForm] = useState({ date_passage: tomorrow, equipe_assignee: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ signalement_id: signalement.id, ...form });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="collecte-form" onSubmit={handleSubmit}>
      <h3>Planifier une collecte — {signalement.commune}</h3>
      <label htmlFor="date-passage">Date de passage</label>
      <input id="date-passage" type="date" min={tomorrow} required value={form.date_passage} onChange={(e) => setForm({ ...form, date_passage: e.target.value })} />
      <label htmlFor="equipe">Équipe assignée</label>
      <input id="equipe" required maxLength="150" placeholder="Ex. Équipe A" value={form.equipe_assignee} onChange={(e) => setForm({ ...form, equipe_assignee: e.target.value })} />
      <div className="action-buttons">
        <button className="primary" type="submit" disabled={submitting}>{submitting ? "Planification..." : "Planifier"}</button>
        <button className="secondary" type="button" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}

export default CollecteForm;
