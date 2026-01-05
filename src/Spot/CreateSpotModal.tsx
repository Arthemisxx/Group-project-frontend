import "./CreateSpotModal.css";
import {useState, useEffect} from "react";
import type {SpotCreate} from "../Utils/Spot.ts";
import {MapContainer, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {FaCamera, FaMapMarkerAlt} from "react-icons/fa";
import {fetchAddressFromCoords} from "../Utils/geocoding.ts";
import heic2any from "heic2any";
import {getGpsFromImage} from "../Utils/gpsUtils.ts";

export interface PhotoDraft {
    file: File;
    previewUrl: string;
    caption: string;
}

interface CreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SpotCreate, photos: PhotoDraft[]) => void;
    clickedLocation: { lat: number; lng: number } | null;
}

const MapCenterUpdater = ({onCenterChange}: { onCenterChange: (lat: number, lng: number) => void }) => {
    useMapEvents({
        move: (e) => {
            const center = e.target.getCenter();
            onCenterChange(center.lat, center.lng);
        },
    });
    return null;
};

const MapProgrammaticMover = ({ coords }: { coords: { lat: number, lng: number } | null }) => {
    const map = useMap();

    useEffect(() => {
        if (coords) {
            map.flyTo([coords.lat, coords.lng], 16, { duration: 1.5 });
        }
    }, [coords, map]);

    return null;
};

export const CreateSpotModal = ({open, onClose, onSubmit, clickedLocation}: CreateModalProps) => {
    const defaultCenter = {lat: 52.0693, lng: 19.4803};

    const initialFormData = {
        title: "",
        description: "",
        addressName: "",
        addressCountry: "",
        addressRegion: "",
        tagNames: [],
        latitude: defaultCenter.lat,
        longitude: defaultCenter.lng
    };

    const [formData, setFormData] = useState<Partial<SpotCreate>>(initialFormData);

    const [flyToPosition, setFlyToPosition] = useState<{ lat: number, lng: number } | null>(null);

    const [tagsInput, setTagsInput] = useState("");
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [photos, setPhotos] = useState<PhotoDraft[]>([]);

    useEffect(() => {
        if (open) {
            const startLat = clickedLocation ? clickedLocation.lat : defaultCenter.lat;
            const startLng = clickedLocation ? clickedLocation.lng : defaultCenter.lng;

            setFormData(prev => ({
                ...prev,
                latitude: startLat,
                longitude: startLng
            }));

            setFlyToPosition({ lat: startLat, lng: startLng });
        }
    }, [clickedLocation, open]);

    useEffect(() => {
        if (!open || !formData.latitude || !formData.longitude) return;

        const timer = setTimeout(async () => {
            setIsLoadingAddress(true);
            const result = await fetchAddressFromCoords(formData.latitude!, formData.longitude!);

            if (result) {
                setFormData(prev => ({
                    ...prev,
                    addressName: result.addressName,
                    addressCountry: result.addressCountry,
                    addressRegion: result.addressRegion
                }));
            }
            setIsLoadingAddress(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [formData.latitude, formData.longitude, open]);

    useEffect(() => {
        if (!open) {
            photos.forEach(photo => URL.revokeObjectURL(photo.previewUrl));
            setPhotos([]);

            setTagsInput("");
            setFormData(initialFormData);
            setIsLoadingAddress(false);
        }
    }, [open]);

    if (!open) return null;

    const handleMapMove = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
        setFormData(prev => ({...prev, tagNames: tagsArray}));
    };

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

                processedDrafts.push({
                    file: fileToUse,
                    previewUrl: previewUrl,
                    caption: ""
                });
            }

            setPhotos(prev => [...prev, ...processedDrafts]);

            const firstOriginalFile = rawFiles[0];

            try {
                const gpsData = await getGpsFromImage(firstOriginalFile);

                if (gpsData && !isNaN(gpsData.latitude)) {
                    console.log("Znaleziono GPS:", gpsData);
                    setFormData(prev => ({
                        ...prev,
                        latitude: gpsData.latitude,
                        longitude: gpsData.longitude
                    }));
                    setFlyToPosition({ lat: gpsData.latitude, lng: gpsData.longitude });
                }
            } catch (error) {
                console.error("Błąd GPS:", error);
            }
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.latitude || !formData.longitude) {
            alert("Uzupełnij wymagane pola (Tytuł)");
            return;
        }

        const newSpot: SpotCreate = {
            title: formData.title!,
            description: formData.description,
            latitude: formData.latitude!,
            longitude: formData.longitude!,
            addressName: formData.addressName || "",
            addressCountry: formData.addressCountry || "",
            addressRegion: formData.addressRegion || "",
            tagNames: formData.tagNames || [],
            categoryId: 0,
        };

        onSubmit(newSpot, photos);

        // Reset formularza
        setTagsInput("");
        setFormData({title: "", description: "", addressCountry: "Polska", tagNames: []});
        setPhotos([]);
    };

    const handleCloseAttempt = () => {

        const isDirty = (formData.title && formData.title.length > 0) ||
            (formData.description && formData.description.length > 0) ||
            photos.length > 0;

        if (isDirty) {
            if (window.confirm("Masz niezapisane zmiany. Czy na pewno chcesz wyjść?")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    return (
        <div className="modal display-block" onClick={handleCloseAttempt}>
            <div className="modal-wrapper create-modal-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="create-modal-scroll-container">

                    <div className="create-header">
                        <h2>Dodaj nowe miejsce</h2>
                        <p className="sub-header">Przesuń mapę lub wgraj zdjęcie z lokalizacją.</p>
                    </div>

                    <form className="create-form" onSubmit={handleSubmit}>

                        <div className="modal-map-wrapper">
                            <div className="map-center-pin"><FaMapMarkerAlt/></div>
                            <div className="map-center-shadow"></div>

                            <MapContainer
                                center={[defaultCenter.lat, defaultCenter.lng]}
                                zoom={13}
                                style={{height: "100%", width: "100%"}}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <MapCenterUpdater onCenterChange={handleMapMove}/>
                                <MapProgrammaticMover coords={flyToPosition}/>

                            </MapContainer>
                        </div>

                        <div className="coords-info">
                            <span>Współrzędne: {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}</span>
                        </div>

                        {/* ZDJĘCIA */}
                        <div className="photo-upload-section">
                            <label className="form-label">Zdjęcia ({photos.length})</label>
                            <input
                                id="spot-photo-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{display: 'none'}}
                            />

                            <label htmlFor="spot-photo-upload" className="photo-upload-btn">
                                <FaCamera/> Dodaj zdjęcia
                            </label>

                            {photos.length > 0 && (
                                <div className="photo-previews-list">
                                    {photos.map((draft, index) => (
                                        <div key={index} className="photo-card">
                                            <div className="photo-thumbnail-wrapper">
                                                <img src={draft.previewUrl} alt="preview" className="photo-thumbnail"/>
                                                <button type="button" className="photo-remove-btn"
                                                        onClick={() => handleRemovePhoto(index)}>x</button>
                                            </div>
                                            <input type="text" className="photo-caption-input" placeholder="Opis..."
                                                   value={draft.caption}
                                                   onChange={(e) => handleCaptionChange(index, e.target.value)}/>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-section">
                            <label className="form-label">Tytuł *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-input"
                                placeholder="np. Ukryty wodospad"
                                value={formData.title || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-section">
                            <label className="form-label">Opis</label>
                            <textarea name="description" className="form-input form-textarea"
                                      placeholder="Opisz to miejsce..." value={formData.description}
                                      onChange={handleChange} rows={3}/>
                        </div>

                        <div className="form-row">
                            <div className="form-section half">
                                <label className="form-label">Miasto / Adres *</label>
                                <div style={{position: 'relative'}}>
                                    <input
                                        type="text"
                                        name="addressName"
                                        className="form-input"
                                        placeholder={isLoadingAddress ? "Pobieranie..." : "np. Gdańsk"}
                                        value={formData.addressName || ""}
                                        onChange={handleChange}
                                        required
                                        style={{width: '100%'}}
                                    />
                                    {isLoadingAddress && <span style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '10px',
                                        fontSize: '12px'
                                    }}>⟳</span>}
                                </div>
                            </div>

                            <div className="form-section half">
                                <label className="form-label">Region</label>
                                <input
                                    type="text"
                                    name="addressRegion"
                                    className="form-input"
                                    placeholder="np. Pomorskie"
                                    value={formData.addressRegion || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <label className="form-label">Tagi</label>
                            <input type="text" className="form-input" placeholder="np. natura, las" value={tagsInput}
                                   onChange={handleTagsChange}/>
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={handleCloseAttempt} className="btn-cancel">Anuluj</button>
                            <button type="submit" className="btn-submit">Utwórz Spot</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};