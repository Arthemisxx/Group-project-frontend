import { useState, useEffect } from 'react';
import './Explore.css';
import { SpotModal } from '../Spot/SpotModal';

export const Explore = () => {
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpot, setSelectedSpot] = useState<any>(null);
    const [selectedSpotPhotos, setSelectedSpotPhotos] = useState<any[]>([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/spots/map/search?minLat=-90&maxLat=90&minLng=-180&maxLng=180')
            .then(r => r.json())
            .then(spots => {
                const photoPromises = spots.map((spot: any) =>
                    fetch(`http://localhost:8080/photos/spot/${spot.id}`)
                        .then(r => r.json())
                        .then(spotPhotos => {
                            return spotPhotos.map((photo: any) => ({
                                ...photo,
                                spot: spot
                            }));
                        })
                        .catch(() => [])
                );

                return Promise.all(photoPromises);
            })
            .then(photoArrays => {
                const allPhotos = photoArrays.flat();
                setPhotos(allPhotos);
                setLoading(false);
            })
            .catch(err => {
                console.error('Błąd:', err);
                setLoading(false);
            });
    }, []);

    const handleCardClick = async (clickedPhoto: any) => {
        const spot = clickedPhoto.spot;

        // Pobierz wszystkie zdjęcia tego spota
        try {
            const photosResponse = await fetch(`http://localhost:8080/photos/spot/${spot.id}`);
            const spotPhotos = await photosResponse.json();

            // Znajdź indeks klikniętego zdjęcia
            const photoIndex = spotPhotos.findIndex((p: any) => p.id === clickedPhoto.id);

            // Pobierz komentarze spota
            const commentsResponse = await fetch(`http://localhost:8080/comments/spot/${spot.id}`);
            const spotComments = await commentsResponse.json();

            setSelectedSpot(spot);
            setSelectedSpotPhotos(spotPhotos);
            setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
            setComments(spotComments);
            setIsModalOpen(true);
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Błąd pobierania danych:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSpot(null);
        setSelectedSpotPhotos([]);
        setComments([]);
        document.body.style.overflow = 'auto';
    };

    const handleAddComment = (content: string) => {
        // Tu możesz dodać logikę wysyłania komentarza do API
        console.log('Nowy komentarz:', content);
        // Tymczasowo dodaj do listy
        const newComment = {
            id: Date.now(),
            content: content,
            author: { displayName: "Ty" },
            createdAt: new Date().toISOString()
        };
        setComments([...comments, newComment]);
    };

    const getRandomHeight = () => {
        const heights = [250, 300, 350, 400, 450];
        return heights[Math.floor(Math.random() * heights.length)];
    };

    if (loading) {
        return (
            <div className="explore-container">
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <p>Ładowanie zdjęć...</p>
                </div>
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div className="explore-container">
                <div className="explore-header">
                    <h2>Odkrywaj niesamowite miejsca</h2>
                    <p>Brak zdjęć do wyświetlenia.</p>
                </div>
            </div>
        );
    }

    return (
        <section className="explore-container">
            <div className="explore-header">
                <h2>Odkrywaj niesamowite miejsca</h2>
                <p>Znaleziono {photos.length} zdjęć. Kliknij aby zobaczyć szczegóły.</p>
            </div>

            <div className="masonry-grid">
                {photos.map((photo) => (
                    <div
                        key={`photo-${photo.id}`}
                        className="grid-item"
                        onClick={() => handleCardClick(photo)}
                    >
                        <img
                            src={photo.url}
                            alt={photo.spot?.title || 'Zdjęcie miejsca'}
                            className="grid-image"
                            style={{ height: `${getRandomHeight()}px` }}
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'https://via.placeholder.com/400x300/cccccc/666666?text=Brak+zdjęcia';
                            }}
                        />

                        <div className="grid-overlay">
                            <h3 className="grid-title">
                                {photo.spot?.title || 'Nieznane miejsce'}
                            </h3>
                            {photo.spot?.address && (
                                <p className="grid-location">
                                    {photo.spot.address.country}
                                    {photo.spot.address.region && `, ${photo.spot.address.region}`}
                                </p>
                            )}
                        </div>

                        <div className="grid-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {selectedSpot && (
                <SpotModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    spot={selectedSpot}
                    photos={selectedSpotPhotos}
                    comments={comments}
                    onAddComment={handleAddComment}
                    initialPhotoIndex={selectedPhotoIndex}
                    showMapButton={true}
                />
            )}
        </section>
    );
};