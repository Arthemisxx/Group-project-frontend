import "./AddPhotoModal.css";
import { useState, useEffect } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import heic2any from "heic2any";
import { uploadSpotPhoto } from "../../Utils/api";

export interface PhotoDraft {
    file: File;
    previewUrl: string;
    caption: string;
}

interface AddPhotoModalProps {
    open: boolean;
    onClose: () => void;
    spotId: number;
    onUploadSuccess: () => void;
}

export const AddPhotoModal = ({ open, onClose, spotId, onUploadSuccess }: AddPhotoModalProps) => {
    const [photos, setPhotos] = useState<PhotoDraft[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!open) {
            photos.forEach(p => URL.revokeObjectURL(p.previewUrl));
            setPhotos([]);
            setIsUploading(false);
        }
    }, [open]);

    if (!open) return null;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const rawFiles = Array.from(e.target.files);
            const processedDrafts: PhotoDraft[] = [];

            for (const file of rawFiles) {
                let fileToUse = file;
                let previewUrl = "";

                if (file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic") {
                    try {
                        const convertedBlob = await heic2any({
                            blob: file,
                            toType: "image/jpeg",
                            quality: 0.8
                        });
                        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                        fileToUse = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
                            type: "image/jpeg"
                        });
                    } catch (err) {
                        console.error("Błąd konwersji HEIC:", err);
                    }
                }

                previewUrl = URL.createObjectURL(fileToUse);
                processedDrafts.push({ file: fileToUse, previewUrl, caption: "" });
            }

            setPhotos(prev => [...prev, ...processedDrafts]);
        }
        e.target.value = "";
    };

    const handleRemovePhoto = (indexToRemove: number) => {
        setPhotos(prev => {
            const updated = prev.filter((_, index) => index !== indexToRemove);
            URL.revokeObjectURL(prev[indexToRemove].previewUrl);
            return updated;
        });
    };

    const handleCaptionChange = (index: number, newCaption: string) => {
        setPhotos(prev => {
            const updated = [...prev];
            updated[index].caption = newCaption;
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (photos.length === 0) return;

        setIsUploading(true);
        try {
            for (const photo of photos) {
                await uploadSpotPhoto(spotId, {
                    file: photo.file,
                    caption: photo.caption
                });
            }

            onUploadSuccess();
            onClose();
        } catch (error) {
            console.error("Błąd wysyłania zdjęć:", error);
            alert("Wystąpił błąd podczas wysyłania zdjęć.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="modal display-block" onClick={onClose}>
            <div className="modal-wrapper add-photo-modal-wrapper" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>

                <div className="modal-header">
                    <h2>Dodaj zdjęcia do miejsca</h2>
                    <p>Wybierz zdjęcia, dodaj opisy i podziel się widokami.</p>
                </div>

                <div className="add-photo-content">
                    <input
                        id="add-spot-photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    <label htmlFor="add-spot-photos" className="photo-upload-btn">
                        <FaCamera /> Wybierz pliki
                    </label>

                    {photos.length > 0 && (
                        <div className="photo-previews-list">
                            {photos.map((draft, index) => (
                                <div key={index} className="photo-card">
                                    <div className="photo-thumbnail-wrapper">
                                        <img src={draft.previewUrl} alt="preview" className="photo-thumbnail" />
                                        <button
                                            type="button"
                                            className="photo-remove-btn"
                                            onClick={() => handleRemovePhoto(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="photo-caption-input"
                                        placeholder="Opis zdjęcia..."
                                        value={draft.caption}
                                        onChange={(e) => handleCaptionChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="btn-cancel" disabled={isUploading}>
                        Anuluj
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="btn-submit"
                        disabled={photos.length === 0 || isUploading}
                    >
                        {isUploading ? "Wysyłanie..." : `Dodaj (${photos.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};