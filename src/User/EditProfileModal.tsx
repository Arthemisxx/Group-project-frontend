import React, { useState } from 'react';
import './User.css';

export interface UserData {
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
}

interface Props {
    user: any;
    onClose: () => void;
    open: boolean;
    onSave: (data: Partial<UserData>) => Promise<void>;
}

const EditProfileModal: React.FC<Props> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        displayName: user.displayName || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Wystąpił błąd podczas zapisywania.");
            setIsSaving(false);
        }
    };

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-content">
                <div className="edit-modal-header">
                    <h3>Edytuj Profil</h3>
                    <button className="edit-close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="edit-form-group edit-avatar-section">
                        <img
                            src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}`}
                            alt="Avatar Preview"
                            className="edit-avatar-preview"
                        />
                        <div className="edit-input-wrapper">
                            <label>URL Avatara</label>
                            <input
                                type="text"
                                name="avatarUrl"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                className="edit-form-input"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="edit-form-group">
                        <label>Nazwa wyświetlana</label>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="edit-form-input"
                            maxLength={30}
                        />
                        <div className="edit-char-count">{formData.displayName.length}/30</div>
                    </div>

                    <div className="edit-form-group">
                        <label>O mnie (Bio)</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="edit-form-input edit-form-textarea"
                            maxLength={150}
                        />
                        <div className="edit-char-count">{formData.bio.length}/150</div>
                    </div>

                    <div className="edit-modal-actions">
                        <button type="button" className="edit-btn-cancel" onClick={onClose} disabled={isSaving}>
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="edit-btn-save"
                            disabled={isSaving}
                            style={{ opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'wait' : 'pointer' }}
                        >
                            {isSaving ? 'Zapisywanie...' : 'Zapisz Zmiany'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;