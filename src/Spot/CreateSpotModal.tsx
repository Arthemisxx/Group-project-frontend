import "./CreateSpotModal.css";
import { useState, useEffect } from "react";
import type { SpotCreate } from "../Utils/Spot.ts";
import {MapContainer, TileLayer, useMapEvents} from "react-leaflet";
import {FaMapMarkerAlt} from "react-icons/fa";

interface Category {
    id: number;
    name: string;
}

interface CreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SpotCreate) => void;
    clickedLocation: { lat: number; lng: number } | null;
    categories: Category[];
}

const MapCenterUpdater = ({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) => {
    const map = useMapEvents({
        move: () => {
            const center = map.getCenter();
            onCenterChange(center.lat, center.lng);
        },
    });
    return null;
};

export const CreateSpotModal = ({ open, onClose, onSubmit, clickedLocation, categories}: CreateModalProps) => {
    const defaultCenter = { lat: 52.0693, lng: 19.4803 };
    const [formData, setFormData] = useState<Partial<SpotCreate>>({
        title: "",
        description: "",
        addressName: "",
        addressCountry: "Polska",
        addressRegion: "",
        tagNames: []
    });

    const [tagsInput, setTagsInput] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>("");

    useEffect(() => {
        if (clickedLocation && open) {
            setFormData(prev => ({
                ...prev,
                latitude: clickedLocation.lat,
                longitude: clickedLocation.lng
            }));
        }
    }, [clickedLocation, open]);

    if (!open) return null;

    const handleMapMove = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
        setFormData(prev => ({ ...prev, tagNames: tagsArray }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const catId = Number(selectedCategoryId);

        if (!formData.title || !formData.latitude || !formData.longitude || !catId) {
            alert("Uzupełnij wymagane pola (Tytuł, Kategoria, Lokalizacja)");
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
            categoryId: catId,
        };

        onSubmit(newSpot);

        setTagsInput("");
        setFormData({ title: "", description: "", addressCountry: "Polska", tagNames: [] });
        setSelectedCategoryId("");
    };

    return (
        <div className="modal display-block" onClick={onClose}>
            <div className="modal-wrapper create-modal-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="create-modal-scroll-container">

                <div className="create-header">
                    <h2>Dodaj nowe miejsce</h2>
                    <p className="sub-header">Uzupełnij szczegóły, aby inni mogli je znaleźć.</p>
                </div>

                <form className="create-form" onSubmit={handleSubmit}>

                    <div className="modal-map-wrapper">
                        <div className="map-center-pin">
                            <FaMapMarkerAlt/>
                        </div>
                        <div className="map-center-shadow"></div>

                        <MapContainer
                            key={`${open}-${clickedLocation?.lat || 'default'}`}
                            center={[formData.latitude || defaultCenter.lat, formData.longitude || defaultCenter.lng]}
                            zoom={15}
                            style={{height: "100%", width: "100%"}}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapCenterUpdater onCenterChange={handleMapMove}/>
                        </MapContainer>
                    </div>

                    <div className="coords-info">
                        <span>
                            Wybrana lokalizacja: {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}
                        </span>
                    </div>

                    <div className="form-section">
                        <label className="form-label">Tytuł *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            placeholder="np. Ukryty wodospad"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label className="form-label">Kategoria *</label>
                        <select
                            className="form-input"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Wybierz kategorię</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-section">
                        <label className="form-label">Opis</label>
                        <textarea
                            name="description"
                            className="form-input form-textarea"
                            placeholder="Opisz co to za miejsce..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-section half">
                            <label className="form-label">Miasto / Adres *</label>
                            <input
                                type="text"
                                name="addressName"
                                className="form-input"
                                placeholder="np. Gdańsk"
                                value={formData.addressName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-section half">
                            <label className="form-label">Region</label>
                            <input
                                type="text"
                                name="addressRegion"
                                className="form-input"
                                placeholder="np. Pomorskie"
                                value={formData.addressRegion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <label className="form-label">Tagi (oddzielone przecinkami)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="np. natura, las, cisza"
                            value={tagsInput}
                            onChange={handleTagsChange}
                        />
                    </div>



                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Anuluj</button>
                        <button type="submit" className="btn-submit">Utwórz Spot</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
};