import React, { useState } from "react";
import { apiRequest, firstValidationError } from "../services/api";

const initialForm = { nom: "", prenom: "", email: "", password: "", password_confirmation: "" };

function Register({ onAuthenticated, onNavigate }) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (form.password !== form.password_confirmation) {
      setMessage("Les deux mots de passe doivent être identiques.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onAuthenticated(data.user, data.token);
    } catch (error) {
      setMessage(firstValidationError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Créer un compte</h1>
        <p>Inscrivez-vous pour enregistrer et suivre vos signalements.</p>
        {message && <p className="feedback error">{message}</p>}
        <label htmlFor="nom">Nom</label>
        <input id="nom" autoComplete="family-name" maxLength="100" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
        <label htmlFor="prenom">Prénom</label>
        <input id="prenom" autoComplete="given-name" maxLength="100" required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
        <label htmlFor="register-email">Adresse email</label>
        <input id="register-email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label htmlFor="register-password">Mot de passe</label>
        <input id="register-password" type="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <small className="field-hint">8 caractères minimum.</small>
        <label htmlFor="password-confirmation">Confirmer le mot de passe</label>
        <input id="password-confirmation" type="password" autoComplete="new-password" minLength="8" required value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Création..." : "Créer mon compte"}
        </button>
        <button className="text-button" type="button" onClick={() => onNavigate("connexion")}>
          J’ai déjà un compte
        </button>
      </form>
    </main>
  );
}

export default Register;
