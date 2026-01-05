import React, { useState } from "react";
import "./VerificationModal.css";
import axiosClient from "../Auth/axiosClient.ts";
import {createPortal} from "react-dom";

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

    return createPortal(
        <div className="verification-modal-overlay" onClick={onClose}>
            <div className="verification-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="verification-modal-close" onClick={onClose}>×</button>
                <h2>Weryfikacja</h2>

                <p className="verification-info-text">
                    Wprowadź kod weryfikacyjny, który wysłaliśmy na adres:<br />
                    <strong>{email}</strong>
                </p>

                {message && (
                    <div className={message.type === "success" ? "verification-msg success" : "verification-msg error"}>
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
                        className="verification-input"
                    />
                    <button type="submit" className="verification-btn-submit" disabled={isLoading}>
                        {isLoading ? "Weryfikuję..." : "Zatwierdź"}
                    </button>
                </form>

                <div className="verification-resend-link">
                    Nie otrzymałeś kodu?
                    <span onClick={handleResend}>
                        Wyślij ponownie
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
}