import React, { useEffect, useState } from "react";

function Navbar({ user, currentPage, unreadCount, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = [
    ["accueil", "Accueil"],
    ["conseils", "Conseils"],
  ];

  if (user) {
    navigation.splice(1, 0, ["signaler", "Signaler"], ["dashboard", "Mes signalements"], ["notifications", `Notifications${unreadCount ? ` (${unreadCount})` : ""}`]);
  }

  if (user?.role === "admin") {
    navigation.push(["admin", "Administration"]);
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPage]);

  function navigate(page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <button className="brand" type="button" onClick={() => navigate("accueil")} aria-label="EcoSignal CI — Accueil">
        <span className="brand-mark" aria-hidden="true">🌿</span>
        <span>EcoSignal <strong>CI</strong></span>
      </button>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        <span className="sr-only">Menu</span>
      </button>

      <nav id="main-navigation" className={menuOpen ? "nav-open" : ""} aria-label="Navigation principale">
        {navigation.map(([page, label]) => (
          <button
            key={page}
            className={currentPage === page ? "active-nav" : ""}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => navigate(page)}
          >
            {label}
          </button>
        ))}

        {!user ? (
          <button className="login" onClick={() => navigate("connexion")}>
            Connexion
          </button>
        ) : (
          <button className="login" onClick={onLogout}>
            Déconnexion
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
