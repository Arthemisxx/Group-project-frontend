import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LoginModal from "../Login/LoginModal";
import RegisterModal from "../Register/RegisterModal";
import VerificationModal from "../Register/VerificationModal";
import {useAuth} from "../Auth/AuthProvider.tsx";
import {FaUser} from "react-icons/fa";

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState("");

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
                                {/* Ikonka profilu */}
                                <Link to="/użytkownik">
                                    <button className="btn-login">
                                        <FaUser/>
                                    </button>
                                </Link>

                                {/* WYLOGUJ */}
                                <button
                                    className="btn-login"
                                    onClick={handleLogout}
                                    style={{fontSize: "0.8rem", padding: "0 15px"}}
                                >
                                    Wyloguj
                                </button>
                            </div>

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
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                }}
                onRegisterSuccess={(email) => {

                    setEmailToVerify(email);
                    setIsRegisterOpen(false);
                    setIsVerifyOpen(true);
                }}
            />


            <VerificationModal
                isOpen={isVerifyOpen}
                onClose={() => setIsVerifyOpen(false)}
                email={emailToVerify}
                onVerified={() => {
                    setIsVerifyOpen(false);
                    setIsLoginOpen(true); //
                }}
            />
        </>
    );
}