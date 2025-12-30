import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from "../Login/LoginModal";
import VerificationModal from "./VerificationModal";
import './Register.css';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);


    const [loginMessage, setLoginMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch("http://localhost:8080/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Rejestracja nieudana");
            }

            setIsVerifyOpen(true);

        } catch (err) {
            setError((err as Error).message || "Wystąpił błąd");
        }
    };

    const handleVerificationSuccess = () => {
        setIsVerifyOpen(false);

        setLoginMessage("Konto zweryfikowane pomyślnie! Zaloguj się, aby kontynuować.");
        setIsLoginOpen(true);
    };

    const handleLoginClose = () => {
        setIsLoginOpen(false);
        setLoginMessage("");
    };

    return (
        <>
            <div className="register-page">
                <div className="register-container">
                    <h1>Dołącz do PhotoSpot 📸</h1>
                    <p>Odkrywaj nieznane miejsca i dziel się swoimi.</p>

                    {error && <div className="error-msg">⚠️ {error}</div>}

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Nazwa użytkownika</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Np. JanPodroznik"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="twoj@email.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Hasło</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 znaków"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-register">Zarejestruj się</button>
                    </form>

                    <div className="login-hint">
                        Masz już konto?
                        <span
                            onClick={() => {
                                setLoginMessage("");
                                setIsLoginOpen(true);
                            }}
                            style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
                        >
                             Zaloguj się
                        </span>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={handleLoginClose}
                initialEmail={email}
                successMessage={loginMessage}
                onLoginSuccess={() => {
                    setIsLoginOpen(false);
                    navigate('/');
                    window.location.reload();
                }}
            />

            <VerificationModal
                isOpen={isVerifyOpen}
                onClose={() => setIsVerifyOpen(false)}
                email={email}
                onVerified={handleVerificationSuccess}
            />
        </>
    );
};