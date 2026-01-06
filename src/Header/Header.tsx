// import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import {useAuth} from "../Auth/AuthProvider.tsx";
import {FaUser} from "react-icons/fa";
import {LoginButton} from "../Login/LoginButton.tsx";

export default function Header() {
    const { isAuthenticated } = useAuth();

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
                        {isAuthenticated ? (
                            <Link to="/uzytkownik">
                                <button className="btn-login">
                                    <FaUser/>
                                </button>
                            </Link>
                        ) : (
                            <LoginButton/>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}