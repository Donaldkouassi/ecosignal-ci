import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Accueil from "./pages/Accueil";
import Carte from "./pages/Carte";
import Conseils from "./pages/Conseils";
import Dashboard from "./pages/Dashboard";
import ListeSignalements from "./pages/ListeSignalements";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import NouveauSignalement from "./pages/NouveauSignalement";
import Register from "./pages/Register";
import { apiRequest, firstValidationError } from "./services/api";

const NOTIFICATIONS_POLL_MS = 25000;

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
  const [toasts, setToasts] = useState([]);
  const lastNotificationIdRef = useRef(null);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

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

  const loadNotifications = useCallback(async ({ background = false } = {}) => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      lastNotificationIdRef.current = null;
      return;
    }

    if (!background) setNotificationsLoading(true);
    try {
      const [notificationResponse, countResponse] = await Promise.all([
        apiRequest("/notifications"),
        apiRequest("/notifications/non-lues"),
      ]);
      const list = notificationResponse.data || [];
      setNotifications(list);
      setUnreadCount(countResponse.unread_count || 0);

      if (list.length > 0) {
        const maxId = Math.max(...list.map((item) => item.id));
        if (lastNotificationIdRef.current !== null) {
          const nouvelles = list.filter((item) => item.id > lastNotificationIdRef.current);
          if (nouvelles.length > 0) {
            setToasts((current) => [
              ...current,
              ...nouvelles.map((item) => ({ id: item.id, titre: item.titre, message: item.message })),
            ]);
          }
        }
        lastNotificationIdRef.current = maxId;
      }
    } catch (error) {
      if (!background) setGlobalMessage(firstValidationError(error));
      if (error.status === 401) clearSession();
    } finally {
      if (!background) setNotificationsLoading(false);
    }
  }, [clearSession, user]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    loadSignalements();
    loadNotifications();

    if (!user) return undefined;

    const poll = () => {
      if (document.visibilityState === "visible") loadNotifications({ background: true });
    };

    const interval = window.setInterval(poll, NOTIFICATIONS_POLL_MS);
    document.addEventListener("visibilitychange", poll);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [loadNotifications, loadSignalements, user]);

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

    if (["signaler", "dashboard", "notifications", "carte", "admin"].includes(nextPage) && !user) {
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

  async function createConseil(payload) {
    try {
      await apiRequest("/conseils", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setGlobalMessage("Le conseil a été publié avec succès.");
      await loadPublicData();
      return true;
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
      return false;
    }
  }

  async function updateConseil(id, payload) {
    try {
      await apiRequest(`/conseils/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setGlobalMessage("Le conseil a été mis à jour.");
      await loadPublicData();
      return true;
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
      return false;
    }
  }

  async function deleteConseil(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce conseil ?")) return;

    try {
      await apiRequest(`/conseils/${id}`, { method: "DELETE" });
      await loadPublicData();
    } catch (error) {
      setGlobalMessage(firstValidationError(error));
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
    case "carte":
      content = <Carte signalements={signalements} loading={loading} />;
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
          conseils={conseils}
          onCreateConseil={createConseil}
          onUpdateConseil={updateConseil}
          onDeleteConseil={deleteConseil}
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
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
