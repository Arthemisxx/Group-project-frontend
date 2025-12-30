import React, { useState } from "react";
import "./LoginModal.css";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
    initialEmail?: string;
    successMessage?: string;
}

export default function LoginModal({
                                       isOpen,
                                       onClose,
                                       onLoginSuccess,
                                       initialEmail = "",
                                       successMessage = ""
                                   }: LoginModalProps) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    React.useEffect(() => {
        if (initialEmail) setEmail(initialEmail);
    }, [initialEmail]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Błąd logowania. Sprawdź dane.");
            }

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                onLoginSuccess();
                onClose();
            } else {
                throw new Error("Błąd serwera: brak tokenu.");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Zaloguj się</h2>

                {}
                {successMessage && (
                    <div style={{
                        backgroundColor: "#d4edda",
                        color: "#155724",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px",
                        fontSize: "0.9rem",
                        textAlign: "center"
                    }}>
                        {successMessage}
                    </div>
                )}

                {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

                <form onSubmit={handleSubmit}>
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
                    />
                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? "Logowanie..." : "Zaloguj"}
                    </button>
                </form>

                <p className="signup-link">
                    Nie masz konta? <a href="/register">Zarejestruj się</a>
                </p>
            </div>
        </div>
    );
}