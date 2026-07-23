import React from "react";
import { storageUrl } from "../services/api";

const statusLabels = {
  en_attente: "En attente",
  en_cours: "En cours",
  resolu: "Résolu",
};

function SignalementCard({ signalement, isAdmin = false, onStatusChange, onDelete, onPlanCollecte }) {
  return (
    <article className="signal-card">
      {signalement.photo_path && (
        <img
          className="signal-card-photo"
          src={storageUrl(signalement.photo_path)}
          alt={`Dépôt de déchets signalé à ${signalement.commune}`}
          loading="lazy"
        />
      )}
      <div>
        <h3>{signalement.commune}</h3>
        <p>{signalement.description}</p>
        <small>
          {signalement.categorie?.charAt(0).toUpperCase() + signalement.categorie?.slice(1)} •{" "}
          {new Date(signalement.created_at).toLocaleDateString("fr-FR")}
        </small>
        {signalement.collecte && (
          <p className="collection-info">
            Collecte : {new Date(signalement.collecte.date_passage).toLocaleDateString("fr-FR")} —{" "}
            {signalement.collecte.equipe_assignee}
          </p>
        )}
      </div>

      <div className="signal-actions">
        <span className={`status ${signalement.statut}`}>
          {statusLabels[signalement.statut] || signalement.statut}
        </span>

        {isAdmin && (
          <div className="action-buttons">
            {!signalement.collecte && (
              <button className="small-btn" onClick={() => onPlanCollecte(signalement)}>
                Planifier
              </button>
            )}
            <button className="small-btn" onClick={() => onStatusChange(signalement.id, "en_cours")}>
              En cours
            </button>
            <button className="small-btn success" onClick={() => onStatusChange(signalement.id, "resolu")}>
              Résolu
            </button>
            <button className="small-btn danger" onClick={() => onDelete(signalement.id)}>
              Supprimer
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default SignalementCard;
