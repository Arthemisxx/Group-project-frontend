import { useState, useEffect } from "react";
import "./EditSpotModal.css";
import type { Spot } from "../Utils/Spot.ts";
import type { Photo } from "../Utils/Photo.ts";
import type { SpotUpdate } from "../Utils/Spot.ts";
import { FaTimes } from "react-icons/fa";
import { updateSpot, deletePhoto } from "../Utils/api.ts";

interface EditSpotModalProps {
    open: boolean;
    onClose: () => void;
    spot: Spot;
    photos: Photo[];
    onSpotUpdated: (updatedSpot: Spot) => void;
    onPhotosUpdated: () => void;
}

function getPhotoUrl(url: string): string {
    if (url.includes("drive.google.com")) {
        const id = url.substring(url.indexOf("/d/") + 3, url.indexOf("/view?"));
        return `https://drive.google.com/thumbnail?id=${id}`;
    } else {
        return url;
    }
}

export const EditSpotModal = ({
                                  open,
                                  onClose,
                                  spot,
                                  photos,
                                  onSpotUpdated,
                                  onPhotosUpdated
                              }: EditSpotModalProps) => {
    const [title, setTitle] = useState(spot.title);
    const [description, setDescription] = useState(spot.description);
    const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setTitle(spot.title);
            setDescription(spot.description || "");
            setLocalPhotos(photos);
        }
    }, [open, spot, photos]);

    const handleSave = async () => {
        if (!title.trim()) return;

        setIsSaving(true);
        try {
            const spotData: SpotUpdate = {
                title: title,
                description: description,
                latitude: spot.latitude,
                longitude: spot.longitude,
                categoryId: 0,
                addressName: spot.address?.name || "",
                addressCountry: spot.address?.country || "",
                addressRegion: spot.address?.region || "",
                tagNames: spot.tags ? spot.tags : []
            };

            const updatedSpot = await updateSpot(spotData, spot.id);

            if (updatedSpot) {
                onSpotUpdated(updatedSpot);
                onClose();
            }
        } catch (error) {
            console.error("Błąd podczas zapisywania spota:", error);
            alert("Nie udało się zapisać zmian. Sprawdź konsolę.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePhoto = async (photoId: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return;

        try {
            await deletePhoto(photoId);
            setLocalPhotos(prev => prev.filter(p => p.id !== photoId));
            onPhotosUpdated();
        } catch (error) {
            console.error("Błąd usuwania zdjęcia:", error);
            alert("Nie udało się usunąć zdjęcia.");
        }
    };

    if (!open) return null;

    return (
        <div className="edit-modal-overlay" onClick={onClose}>
            <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="edit-modal-header">
                    <h3 className="edit-modal-title">Edytuj miejsce</h3>
                    <button className="modal-close-icon" onClick={onClose} style={{position: 'static', color: '#333'}}>
                        <FaTimes />
                    </button>
                </div>

                <div className="edit-form-group">
                    <label className="edit-label">Nazwa miejsca</label>
                    <input
                        type="text"
                        className="edit-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="edit-form-group">
                    <label className="edit-label">Opis</label>
                    <textarea
                        className="edit-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="edit-form-group">
                    <label className="edit-label">Zdjęcia ({localPhotos.length})</label>
                    <div className="edit-photos-grid">
                        {localPhotos.map((photo) => (
                            <div key={photo.id} className="edit-photo-item">
                                <img
                                    src={getPhotoUrl(photo.url)}
                                    alt="Thumbnail"
                                    className="edit-photo-img"
                                />
                                <button
                                    className="delete-photo-btn"
                                    onClick={() => handleDeletePhoto(photo.id)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                    {localPhotos.length === 0 && <p style={{color: '#999'}}>Brak zdjęć.</p>}
                </div>

                <div className="edit-modal-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={isSaving}>Anuluj</button>
                    <button className="btn-save" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Zapisywanie..." : "Zapisz"}
                    </button>
                </div>

            </div>
        </div>
    );
};