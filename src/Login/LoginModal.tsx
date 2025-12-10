import React from "react";
import "./LoginModal.css";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <h2>Zaloguj się</h2>

                <form>
                    <input
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        required
                    />
                    <button type="submit" className="btn-submit">Zaloguj</button>
                </form>

                <p className="signup-link">
                    Nie masz konta? <a href="/register">Zarejestruj się</a>
                </p>
            </div>
        </div>
    );
}