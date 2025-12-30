import React, { useState } from "react";
import "./Register.css";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onVerified: () => void;
}

export default function VerificationModal({ isOpen, onClose, email, onVerified }: VerificationModalProps) {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch("http://localhost:8080/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    verificationCode: code
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Weryfikacja nieudana");
            }

            setMessage({ text: "Konto zweryfikowane pomyślnie!", type: "success" });

            setTimeout(() => {
                onVerified();
                onClose();
            }, 1500);

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Wystąpił błąd";
            setMessage({ text: errorMsg, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setMessage(null);
        try {
            const response = await fetch(`http://localhost:8080/auth/resend?email=${email}`, {
                method: "POST"
            });

            if (!response.ok) throw new Error("Błąd wysyłania kodu");

            setMessage({ text: "Kod został wysłany ponownie.", type: "success" });
        } catch {
            setMessage({ text: "Nie udało się wysłać kodu ponownie.", type: "error" });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Weryfikacja Konta</h2>
                <p>Wprowadź kod wysłany na adres: <strong>{email}</strong></p>

                {message && (
                    <div style={{ color: message.type === "success" ? "green" : "red", margin: "10px 0" }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        placeholder="Kod weryfikacyjny"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? "Weryfikuję..." : "Zatwierdź"}
                    </button>
                </form>

                <div style={{ marginTop: "15px", fontSize: "0.9rem" }}>
                    Nie otrzymałeś kodu?
                    <button
                        onClick={handleResend}
                        style={{ background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}
                    >
                        Wyślij ponownie
                    </button>
                </div>
            </div>
        </div>
    );
}