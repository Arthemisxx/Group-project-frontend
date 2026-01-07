import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SpotModal } from "../Spot/SpotModal";
import "./TagGallery.css";

export const TagGallery = () => {
    const { tagName } = useParams<{ tagName: string }>();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadTagPhotos = async () => {
            setLoading(true);
            try {
                const spotsRes = await fetch(`http://localhost:8080/spots/tag?tagName=${tagName}`);
                const spots = await spotsRes.json();
                
                let allPhotos: any[] = [];
                for (const spot of spots) {
                    const photoRes = await fetch(`http://localhost:8080/photos/spot/${spot.id}`);
                    const spotPhotos = await photoRes.json();
                    allPhotos = [...allPhotos, ...spotPhotos.map((p: any) => ({ ...p, spot }))];
                }
                
                setPhotos(allPhotos);
                setLoading(false);
            } catch (err) {
                console.error("Błąd ładowania galerii:", err);
                setLoading(false);
            }
        };

        if (tagName) loadTagPhotos();
    }, [tagName]);

    const handlePhotoClick = (photo: any) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    if (loading) return <div className="loader">Ładowanie galerii...</div>;

    if (photos.length === 0) {
        return (
            <div className="empty-gallery">
                <h2>Nic tu nie ma!</h2>
                <p>Nikt jeszcze nie dodał zdjęć z kategorii "{tagName}".</p>
                <button className="back-btn" onClick={() => navigate('/')}>
                    Wróć na stronę główną
                </button>
            </div>
        );
    }

    return (
        <div className="tag-gallery-container">
            <header className="tag-gallery-header">
                <button className="back-link" onClick={() => navigate(-1)}>← Powrót</button>
                <h1>Kategoria: {tagName}</h1>
            </header>

            <div className="tag-photos-grid">
                {photos.map((photo, index) => (
                    <div key={index} className="tag-photo-card" onClick={() => handlePhotoClick(photo)}>
                        <img src={photo.url} alt={photo.spot.title} className="gallery-img" />
                    </div>
                ))}
            </div>

            {selectedPhoto && (
                <SpotModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    spot={selectedPhoto.spot}
                    photos={[selectedPhoto]}
                    comments={[]} 
                    onAddComment={(content) => console.log(content)}
                />
            )}
        </div>
    );
};