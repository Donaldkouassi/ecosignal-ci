import React, { useState } from "react";
import { apiRequest, firstValidationError } from "../services/api";

function Login({ onAuthenticated, onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/auth/login", {
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
        <span className="auth-icon" aria-hidden="true">↗</span>
        <h1>Connexion à EcoSignal</h1>
        <p className="auth-intro">Connectez-vous pour signaler un dépôt et suivre son traitement.</p>
        {message && <p className="feedback error">{message}</p>}
        <label htmlFor="login-email">Adresse email</label>
        <input id="login-email" type="email" autoComplete="email" placeholder="vous@exemple.ci" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label htmlFor="login-password">Mot de passe</label>
        <div className="password-field">
          <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Votre mot de passe" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            {showPassword ? "Masquer" : "Afficher"}
          </button>
        </div>
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Connexion..." : "Se connecter"}
        </button>
        <aside className="demo-hint">
          <strong>Compte de démonstration</strong>
          <span>citoyen@ecosignal.ci · password123</span>
        </aside>
        <button className="text-button" type="button" onClick={() => onNavigate("inscription")}>
          Pas encore de compte ? <strong>S’inscrire</strong>
        </button>
      </form>
    </main>
  );
}

export default Login;
