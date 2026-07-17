import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Erreur d’affichage EcoSignal CI", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error" role="alert">
          <span aria-hidden="true">🌿</span>
          <h1>Cette page n’a pas pu s’afficher</h1>
          <p>Vos données sont conservées. Rechargez la page pour reprendre votre navigation.</p>
          <button className="primary" type="button" onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
