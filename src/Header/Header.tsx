import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LoginModal from "../Login/LoginModal";
import {useAuth} from "../Auth/AuthProvider.tsx";
import {FaUser} from "react-icons/fa";

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isAuthenticated} = useAuth();

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
                            <Link to="/użytkownik">
                                <button
                                    className="btn-login"
                                >
                                    <FaUser />
                                </button>
                            </Link>

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
            />
        </>
    );
}