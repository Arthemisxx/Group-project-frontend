import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <div className="header-wrapper">
      <div className="header-bar">
        <div className="logo">
          <a href="/"><u>PHOTOSPOT</u></a>
        </div>

        <nav className="main-nav" aria-label="Główna nawigacja">
          <ul>
            <li><a href="/mapa"><u>Mapa</u></a></li>
            <li><a href="/odkrywaj"><u>Odkrywaj</u></a></li>
          </ul>
        </nav>

        <div className="actions">
          <button className="btn-login">Zaloguj Się</button>
        </div>
      </div>
    </div>
  );
}
