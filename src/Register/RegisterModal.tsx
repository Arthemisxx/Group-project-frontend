import React, { useState } from "react";
import "./RegisterModal.css";
import axiosClient from "../Auth/axiosClient.ts";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
    onRegisterSuccess: (email: string) => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onRegisterSuccess }: RegisterModalProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosClient.post('/auth/signup', { username, email, password });

            onRegisterSuccess(email);

            setUsername('');
            setEmail('');
            setPassword('');

        } catch (error) {
            alert('Rejestracja nieudana. Spróbuj ponownie.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <h2>Załóż konto</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    <button type="submit" className="btn-submit">Zarejestruj się</button>
                </form>

                <p className="signup-link">
                    Masz już konto?
                    <span onClick={() => {
                        onClose();
                        onSwitchToLogin();
                    }}>
                        Zaloguj się
                    </span>
                </p>
            </div>
        </div>
    );
}