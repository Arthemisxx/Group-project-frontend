import { useState, useEffect } from 'react';
import './User.css';

interface UserData {
    id: number;
    username: string;
    email: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
}

interface EditProfileModalProps {
    user: UserData;
    onClose: () => void;
    onSave: (updatedData: Partial<UserData>) => Promise<void>;
}

const EditProfileModal = ({ user, onClose, onSave }: EditProfileModalProps) => {
    const [formData, setFormData] = useState({
        displayName: user.displayName || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
    });
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        setFormData({
            displayName: user.displayName || '',
            bio: user.bio || '',
            avatarUrl: user.avatarUrl || '',
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        await onSave(formData);
        setSaving(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edytuj profil</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">

                    {/* AVATAR */}
                    <div className="form-group avatar-section">
                        <img
                            src={formData.avatarUrl || 'https://via.placeholder.com/100'}
                            alt="Preview"
                            className="avatar-preview"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100')}
                        />
                        <div className="input-wrapper">
                            <label>Link do awatara (URL)</label>
                            <input
                                type="text"
                                name="avatarUrl"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* DISPLAY NAME */}
                    <div className="form-group">
                        <label>Nazwa wyświetlana</label>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            maxLength={30}
                            className="form-input"
                        />
                    </div>

                    {/* BIO */}
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            maxLength={150}
                            className="form-input form-textarea"
                            rows={3}
                        />
                        <span className="char-count">{formData.bio.length} / 150</span>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
                        <button type="submit" className="btn-save" disabled={saving}>
                            {saving ? 'Zapisywanie...' : 'Zapisz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;