import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Conseils from "./pages/Conseils";
import Dashboard from "./pages/Dashboard";
import ListeSignalements from "./pages/ListeSignalements";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import NouveauSignalement from "./pages/NouveauSignalement";
import Register from "./pages/Register";
import { apiRequest, firstValidationError } from "./services/api";

const emptyStats = {
  total_signalements: 0,
  en_attente: 0,
  en_cours: 0,
  resolus: 0,
  par_commune: [],
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("ecosignal_user")) || null;
  } catch {
    return null;
  }
}

function App() {
  const [page, setPage] = useState("accueil");
  const [user, setUser] = useState(getStoredUser);
  const [signalements, setSignalements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conseils, setConseils] = useState([]);
  const [statistiques, setStatistiques] = useState(emptyStats);
  const [loading, setLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [publicLoading, setPublicLoading] = useState(true);
  const [globalMessage, setGlobalMessage] = useState("");

  const clearSession = useCallback((nextPage = "connexion") => {
    localStorage.removeItem("ecosignal_token");
    localStorage.removeItem("ecosignal_user");
    setUser(null);
    setSignalements([]);
    setNotifications([]);
    setUnreadCount(0);
    setPage(nextPage);
  }, []);

  const loadPublicData = useCallback(async () => {
    setPublicLoading(true);
    try {
      const [conseilsData, statistiquesData] = await Promise.all([
        apiRequest("/conseils"),
        apiRequest("/statistiques"),
      ]);
      setConseils(conseilsData);
      setStatistiques(statistiquesData);
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
    } finally {
      setPublicLoading(false);
    }
  }, []);

  const loadSignalements = useCallback(async () => {
    if (!user) {
      setSignalements([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/signalements?per_page=50");
      setSignalements(response.data || []);
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
      if (error.status === 401) clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession, user]);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setNotificationsLoading(true);
    try {
      const [notificationResponse, countResponse] = await Promise.all([
        apiRequest("/notifications"),
        apiRequest("/notifications/non-lues"),
      ]);
      setNotifications(notificationResponse.data || []);
      setUnreadCount(countResponse.unread_count || 0);
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
      if (error.status === 401) clearSession();
    } finally {
      setNotificationsLoading(false);
    }
  }, [clearSession, user]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    loadSignalements();
    loadNotifications();
  }, [loadNotifications, loadSignalements]);

  function handleAuthenticated(authenticatedUser, token) {
    localStorage.setItem("ecosignal_token", token);
    localStorage.setItem("ecosignal_user", JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    setGlobalMessage("");
    setPage(authenticatedUser.role === "admin" ? "admin" : "dashboard");
  }

  async function handleLogout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // La session locale est supprimée même si le serveur est indisponible.
    } finally {
      clearSession("accueil");
    }
  }

  function navigate(nextPage) {
    setGlobalMessage("");

    if (["signaler", "dashboard", "notifications", "admin"].includes(nextPage) && !user) {
      setPage("connexion");
      return;
    }

    if (nextPage === "admin" && user?.role !== "admin") {
      setGlobalMessage("Cette section est réservée aux administrateurs.");
      setPage("dashboard");
      return;
    }

    setPage(nextPage);
  }

  async function refreshAfterChange() {
    await Promise.all([loadSignalements(), loadNotifications(), loadPublicData()]);
  }

  async function updateStatus(id, statut) {
    try {
      await apiRequest(`/signalements/${id}/statut`, {
        method: "PATCH",
        body: JSON.stringify({ statut }),
      });
      await refreshAfterChange();
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
    }
  }

  async function deleteSignalement(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce signalement ?")) return;

    try {
      await apiRequest(`/signalements/${id}`, { method: "DELETE" });
      await refreshAfterChange();
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
    }
  }

  async function planCollecte(payload) {
    try {
      await apiRequest("/collectes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setGlobalMessage("La collecte a été planifiée et le citoyen a été notifié.");
      await refreshAfterChange();
      return true;
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
      return false;
    }
  }

  async function markNotificationAsRead(id) {
    try {
      await apiRequest(`/notifications/${id}/lue`, { method: "PATCH" });
      await loadNotifications();
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
    }
  }

  let content;
  switch (page) {
    case "connexion":
      content = <Login onAuthenticated={handleAuthenticated} onNavigate={navigate} />;
      break;
    case "inscription":
      content = <Register onAuthenticated={handleAuthenticated} onNavigate={navigate} />;
      break;
    case "signaler":
      content = (
        <NouveauSignalement
          onCreated={async () => {
            await refreshAfterChange();
            setPage("dashboard");
          }}
        />
      );
      break;
    case "dashboard":
      content = <Dashboard signalements={signalements} loading={loading} user={user} />;
      break;
    case "notifications":
      content = (
        <Notifications
          notifications={notifications}
          loading={notificationsLoading}
          onMarkAsRead={markNotificationAsRead}
        />
      );
      break;
    case "conseils":
      content = <Conseils conseils={conseils} />;
      break;
    case "admin":
      content = (
        <ListeSignalements
          signalements={signalements}
          statistiques={statistiques}
          loading={loading}
          onStatusChange={updateStatus}
          onDelete={deleteSignalement}
          onPlanCollecte={planCollecte}
        />
      );
      break;
    default:
      content = (
        <Accueil
          statistiques={statistiques}
          conseilsCount={conseils.length}
          loading={publicLoading}
          user={user}
          onNavigate={navigate}
        />
      );
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <Navbar
        user={user}
        currentPage={page}
        unreadCount={unreadCount}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
      {globalMessage && (
        <div className="global-feedback" role="alert">
          <span>{globalMessage}</span>
          <button type="button" onClick={() => setGlobalMessage("")} aria-label="Fermer le message">✕</button>
        </div>
      )}
      <div id="main-content">{content}</div>
      <Footer />
    </div>
  );
}

export default App;
