import React from "react";
import BrandMark from "./BrandMark";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <BrandMark size={30} />
          <div>
            <strong>EcoSignal CI</strong>
            <p>Un service citoyen pour des quartiers propres, en Côte d'Ivoire.</p>
          </div>
        </div>
        <p className="footer-meta">Fonds de carte OpenStreetMap et CARTO.</p>
      </div>
    </footer>
  );
}

export default Footer;
