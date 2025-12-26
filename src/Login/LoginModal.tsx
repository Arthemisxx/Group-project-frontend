import React from "react";
import {useState} from "react";
import "./LoginModal.css";
import axiosClient from "../Auth/axiosClient.ts";
import {useAuth} from "../Auth/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Pobieramy funkcję login z kontekstu
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/auth/login', { email :username, password });

            const token = response.data.token;

            login(token);

            onClose();
            navigate('/mapa');
        } catch (error) {
            alert('Błędne dane logowania');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <h2>Zaloguj się</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={username}
                        onChange={(e)=> setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
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