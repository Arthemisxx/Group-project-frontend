import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LoginModal from "../Login/LoginModal";

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);


    const isUserLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <>
            <div className="header-wrapper">
                <div className="header-bar">
                    <div className="logo">
                        <Link to="/">PHOTOSPOT</Link>
                    </div>

                    <nav className="main-nav" aria-label="Główna nawigacja">
                        <ul>
                            <li><Link to="/mapa">Mapa</Link></li>
                            <li><Link to="/odkrywaj">Odkrywaj</Link></li>
                        </ul>
                    </nav>

                    <div className="actions">
                        {isUserLoggedIn ? (

                            <button
                                className="btn-login"
                                onClick={handleLogout}
                            >
                                Wyloguj
                            </button>
                        ) : (

                            <button
                                className="btn-login"
                                onClick={() => setIsLoginOpen(true)}
                            >
                                Zaloguj Się
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}

                onLoginSuccess={() => window.location.reload()}
            />
        </>
    );
}