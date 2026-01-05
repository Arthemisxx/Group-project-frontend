import LoginModal from "./LoginModal.tsx";
import RegisterModal from "../Register/RegisterModal.tsx";
import VerificationModal from "../Register/VerificationModal.tsx";
import {useState} from "react";

export const LoginButton = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState("");


    return (
        <>
            <button className="btn-login" onClick={() => setIsLoginOpen(true)}>
                Zaloguj Się

            </button>
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                }}/><RegisterModal
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
            }}/><VerificationModal
            isOpen={isVerifyOpen}
            onClose={() => setIsVerifyOpen(false)}
            email={emailToVerify}
            onVerified={() => {
                setIsVerifyOpen(false);
                setIsLoginOpen(true); //
            }}/></>
    );
};