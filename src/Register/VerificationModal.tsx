import React, { useState } from "react";
import "./VerificationModal.css";
import axiosClient from "../Auth/axiosClient.ts";

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

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            // Endpoint weryfikacji
            await axiosClient.post("/auth/verify", {
                email: email,
                verificationCode: code
            });

            setMessage({ text: "Konto zweryfikowane pomyślnie!", type: "success" });

            // Czekamy 1.5 sekundy, żeby użytkownik zobaczył sukces, i przełączamy na logowanie
            setTimeout(() => {
                onVerified();
                setCode("");
                setMessage(null);
            }, 1500);

        } catch (error: any) {
            const errorMsg = error.response?.data || "Kod nieprawidłowy lub wygasł.";
            setMessage({ text: typeof errorMsg === 'string' ? errorMsg : "Błąd weryfikacji", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setMessage(null);
        try {
            await axiosClient.post(`/auth/resend?email=${email}`);
            setMessage({ text: "Nowy kod został wysłany na Twój email.", type: "success" });
        } catch {
            setMessage({ text: "Nie udało się wysłać kodu ponownie.", type: "error" });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Weryfikacja</h2>

                <p className="info-text">
                    Wprowadź kod weryfikacyjny, który wysłaliśmy na adres: <br/>
                    <strong>{email}</strong>
                </p>

                {message && (
                    <div className={message.type === "success" ? "msg-success" : "msg-error"}>
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

                <div className="resend-link">
                    Nie otrzymałeś kodu?
                    <span onClick={handleResend}>
                        Wyślij ponownie
                    </span>
                </div>
            </div>
        </div>
    );
}