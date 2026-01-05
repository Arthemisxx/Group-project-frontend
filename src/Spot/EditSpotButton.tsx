import { FaEdit } from "react-icons/fa";
import "./EditSpotModal.css";

interface EditSpotButtonProps {
    onClick: () => void;
    className?: string;
}

export const EditSpotButton = ({ onClick, className = "" }: EditSpotButtonProps) => {
    return (
        <button className={`edit-spot-trigger-btn ${className}`} onClick={onClick}>
            <FaEdit /> Edytuj
        </button>
    );
};