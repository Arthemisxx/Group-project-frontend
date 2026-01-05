import { Link } from "react-router-dom";
import "./Header.css";
import {useAuth} from "../Auth/AuthProvider.tsx";
import {FaUser} from "react-icons/fa";
import {LoginButton} from "../Login/LoginButton.tsx";

export default function Header() {
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout();

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
                        {isAuthenticated ? (

                            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <Link to="/użytkownik">
                                    <button className="btn-login">
                                        <FaUser/>
                                    </button>
                                </Link>

                                <button
                                    className="btn-login"
                                    onClick={handleLogout}
                                    style={{fontSize: "0.8rem", padding: "0 15px"}}
                                >
                                    Wyloguj
                                </button>
                            </div>

                        ) : (
                            <LoginButton/>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}