import React from "react";

function Notifications({ notifications, loading, onMarkAsRead }) {
  return (
    <main className="page">
      <section className="title-box">
        <h1>Mes notifications</h1>
        <p>Retrouvez les informations liées au traitement de vos signalements.</p>
      </section>

      {loading ? (
        <p>Chargement...</p>
      ) : notifications.length === 0 ? (
        <p className="empty-state">Aucune notification disponible.</p>
      ) : (
        <div className="list">
          {notifications.map((notification) => (
            <article className={`notification-card ${notification.lue ? "read" : "unread"}`} key={notification.id}>
              <div>
                <h3>{notification.titre}</h3>
                <p>{notification.message}</p>
                <small>{new Date(notification.created_at).toLocaleString("fr-FR")}</small>
              </div>
              {!notification.lue && (
                <button className="small-btn" onClick={() => onMarkAsRead(notification.id)}>
                  Marquer comme lue
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Notifications;
