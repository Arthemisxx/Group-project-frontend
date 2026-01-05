import { FaCamera } from "react-icons/fa";
import "./AddPhotoModal.css";

interface AddPhotoButtonProps {
    onClick: () => void;
    className?: string;
}

export const AddPhotoButton = ({ onClick, className = "" }: AddPhotoButtonProps) => {
    return (
        <button className={`add-photo-button ${className}`} onClick={onClick}>
            <FaCamera /> Dodaj zdjęcia
        </button>
    );
};