import "./CreateSpotButton.css";
import { FaPlus, FaMapMarkerAlt } from "react-icons/fa";

interface AddSpotButtonProps {
    onClick: () => void;
    variant?: 'fab' | 'standard' | 'outline';
    className?: string;
    label?: string;
}

export const CreateSpotButton = ({
                                  onClick,
                                  variant = 'fab',
                                  className = '',
                                  label = "Dodaj miejsce"
                              }: AddSpotButtonProps) => {

    return (
        <button
            className={`add-spot-btn ${variant} ${className}`}
            onClick={onClick}
            title="Dodaj nowe miejsce"
        >
            {variant === 'fab' ? <FaPlus size={20} /> : <FaMapMarkerAlt className="btn-icon" />}

            {variant !== 'fab' && <span className="btn-label">{label}</span>}
        </button>
    );
};