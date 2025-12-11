import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from "../Login/LoginModal"; 
import './Register.css'; 

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    
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

            alert("Konto założone! Możesz się teraz zalogować.");
            
            navigate('/');
            setIsLoginOpen(true); 

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="register-page">
                <div className="register-container">
                    <h1>Dołącz do PHOTOSPOT</h1>
                    <p>Odkrywaj nowe miejsca i dziel się swoimi.</p>
                    
                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Nazwa użytkownika</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nazwa użytkownika"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Hasło</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Hasło"
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-register">Zarejestruj się</button>
                    </form>

                    <div className="login-hint" style={{marginTop: '20px'}}>
                        Masz już konto? {" "}
                        <span 
                            onClick={() => setIsLoginOpen(true)} 
                            style={{cursor: 'pointer', color: '#007bff', fontWeight: 'bold'}}
                        >
                             Zaloguj się
                        </span>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </>
    );
};