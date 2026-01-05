import './MapView.css';
import {Map} from "./components/Map.tsx"
import {GoogleButton} from "./components/GoogleButton.tsx";
import {useState, useEffect} from "react";
import {useSearchParams} from 'react-router-dom';
import type {Spot, SpotCreate} from "../Utils/Spot.ts";
import type {Photo} from "../Utils/Photo.ts";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {FaRegUser} from "react-icons/fa";
import {SpotModal} from "../Spot/SpotModal.tsx";
import type {Comment} from "../Utils/Comment.ts";
import type {PostComment} from "../Utils/postComment.ts";
import {insertComment, insertSpot, uploadSpotPhoto} from "../Utils/api.ts";
import {useAuth} from "../Auth/AuthProvider.tsx";
import {CreateSpotButton} from "../Spot/CreateSpotButton.tsx";
import {CreateSpotModal, type PhotoDraft} from "../Spot/CreateSpotModal.tsx";
import {AddPhotoButton} from "../Spot/Photos/AddPhotoButton.tsx";
import {AddPhotoModal} from "../Spot/Photos/AddPhotoModal.tsx";
import {LoginButton} from "../Login/LoginButton.tsx";

export const MapView = () => {
    const [currentSpot, setCurrentSpot] = useState<Spot | null>(null)
    const [currentSpotPhotos, setCurrentSpotPhotos] = useState<Photo[]>([])
    const [currentSpotComments, setCurrentSpotComments] = useState<Comment[]>([])
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [refreshSpots, setRefreshSpots] = useState<number>(0)
    const [mapTargetLocation, setMapTargetLocation] = useState<{ lat: number, lng: number } | null>(null);

    const {isAuthenticated} = useAuth();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSpotLocation, setNewSpotLocation] = useState<{ lat: number, lng: number } | null>(null);

    // NOWE - obsługa wyszukiwania z URL
    const [searchParams] = useSearchParams();
    const [searchedLocation, setSearchedLocation] = useState<string>('');

    // Odbierz parametr search z URL
    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            console.log('Przyszło wyszukiwanie:', searchQuery);
            setSearchedLocation(searchQuery);
            searchLocationOnMap(searchQuery);
        }
    }, [searchParams]);

    // Funkcja wyszukująca miejsce
    const searchLocationOnMap = async (query: string) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
            );
            const results = await response.json();

            if (results && results.length > 0) {
                const place = results[0];
                const lat = parseFloat(place.lat);
                const lng = parseFloat(place.lon);

                console.log(`Znaleziono: ${place.display_name}`);
                setMapTargetLocation({ lat, lng });
            } else {
                alert(`Nie znaleziono miejsca: ${query}`);
            }
        } catch (error) {
            console.error('Błąd wyszukiwania:', error);
            alert('Wystąpił błąd podczas wyszukiwania');
        }
    };

    function handleSpotDataFromMap(spot: Spot | null) {
        setCurrentSpot(spot)
    }

    function handlePhotosDataFromMap(photos: Photo[]) {
        setCurrentSpotPhotos(photos ?? [])
    }

    function handleCommentsDataFromMap(comments: Comment[]) {
        setCurrentSpotComments(comments ?? [])
    }

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: 'ondemand' as const,
        adaptiveHeight: true,
    }

    function getPhotoUrl(url: string): string {
        if (url.includes("drive.google.com")) {
            const id = url.substring(url.indexOf("/d/") + 3, url.indexOf("/view?"));
            console.log(id);
            return `https://drive.google.com/thumbnail?id=${id}`;
        } else {
            return url;
        }
    }

    async function handleAddComment(content: string) {
        if (!currentSpot) return;

        try {
            const newComment: PostComment = {
                content: content,
                photoId: null,
                spotId: currentSpot.id,
            }
            console.log(newComment);
            await insertComment(newComment);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Błąd dodawania komentarza", error);
        }
    }

    const handleCreateSpot = async (data: SpotCreate, photos: PhotoDraft[]) => {
        try {
            console.log("Tworzenie spota...");

            const createdSpot = await insertSpot(data);
            const newSpotId = createdSpot.id;

            console.log(`Spot utworzony (ID: ${newSpotId}).`);

            if (photos.length > 0) {
                console.log(`Wysyłanie ${photos.length} zdjęć...`);

                await Promise.all(photos.map(photoDraft => {
                    return uploadSpotPhoto(newSpotId, {
                        file: photoDraft.file,
                        caption: photoDraft.caption
                    });
                }));
            }

            setShowCreateModal(false);
            setRefreshSpots(prev => prev + 1);
            setMapTargetLocation({
                lat: createdSpot.latitude,
                lng: createdSpot.longitude
            });
            alert("Miejsce i zdjęcia zostały dodane!");

        } catch (error) {
            console.error("Błąd podczas tworzenia spota:", error);
            alert("Wystąpił błąd. Sprawdź konsolę.");
        }
    };

    const handleFabClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setNewSpotLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setShowCreateModal(true);
            }, () => {
                setNewSpotLocation(null);
                setShowCreateModal(true);
            });
        } else {
            setShowCreateModal(true);
        }
    };

    return (
        <div className={"map-view-wrapper"}>
            <div className={`info-view ${currentSpot ? "open" : "closed"}`}>

                {currentSpot && (
                    <>
                        <div className={"photos-info-wrapper"}>
                            <div className={"slider-container"}>
                                {currentSpotPhotos.length > 0 ? (
                                    <>
                                        {isAuthenticated && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                zIndex: 10
                                            }}>
                                                <AddPhotoButton
                                                    onClick={() => setShowAddPhotoModal(true)}
                                                    className="mini-btn"
                                                />
                                            </div>
                                        )}
                                        <Slider {...sliderSettings}>
                                            {currentSpotPhotos?.map((photo, index) => (
                                                <div className={"current-photo-wrapper"} key={photo.id}>
                                                    <div className={"photo-wrapper"}>
                                                        <img src={getPhotoUrl(photo.url)} alt="" className={"spot-photo"}
                                                             onClick={() => {
                                                                 setSelectedPhotoIndex(index)
                                                                 setShowModal(true)
                                                             }}/>
                                                        <div className={"photo-info-wrapper"}>
                                                            <p className={"caption"}>{photo.caption}</p>
                                                            <p className={"author"}><FaRegUser/> Julia Staniszewska</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Slider>
                                    </>
                                ) : (
                                    <div className="no-photos">
                                        {isAuthenticated ? (
                                            <>
                                                <h2>Nikt jeszcze nie dodał zdjęcia</h2>
                                                <p>Chcesz być pierwszy?</p>
                                                <div style={{marginTop: '15px'}}>
                                                    <AddPhotoButton onClick={() => setShowAddPhotoModal(true)}/>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h2>Nikt jeszcze nie dodał zdjęcia</h2>
                                                <p>Chcesz być pierwszy?</p>
                                                <LoginButton/>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={"spot-info-wrapper"}>
                            <p className={"spot-name"}
                               onClick={() => {
                                   setSelectedPhotoIndex(0)
                                   setShowModal(true)
                               }}>{currentSpot?.title}</p>
                            <p className={"label"}>Opis</p>
                            <p className={"descr"}>{currentSpot?.description}</p>
                        </div>

                        <div className="comments-section">
                            <h3>Komentarze</h3>

                            <div className="comments-list">
                                {currentSpotComments.length > 0 ? (
                                    currentSpotComments.map(comment => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-author">{comment.author.displayName}</div>
                                            <div className="comment-date">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </div>
                                            <p className="comment-content">{comment.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-comments">Brak komentarzy</p>
                                )}
                            </div>
                        </div>
                        <div className="spot-google-btn-wrapper">
                            <GoogleButton lat={currentSpot?.latitude} long={currentSpot?.longitude}/>
                        </div>
                    </>
                )}
            </div>

            <div className={`map-view ${currentSpot ? "with-spot" : "no-spot"}`}>
                <Map
                    sendSpotDataToMapView={handleSpotDataFromMap}
                    sendPhotosDataToMapView={handlePhotosDataFromMap}
                    sendCommentsDataToMapView={handleCommentsDataFromMap}
                    refreshTrigger={refreshTrigger}
                    refreshSpots={refreshSpots}
                    flyToLocation={mapTargetLocation}
                    searchQuery={searchedLocation}
                />

                {isAuthenticated && (
                    <div style={{position: 'absolute', bottom: '30px', right: '30px', zIndex: 1000}}>
                        <CreateSpotButton
                            onClick={handleFabClick}
                            variant="fab"
                        />
                    </div>
                )}
            </div>

            {showModal && currentSpot && (
                <SpotModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    spot={currentSpot}
                    photos={currentSpotPhotos}
                    comments={currentSpotComments}
                    onAddComment={handleAddComment}
                    initialPhotoIndex={selectedPhotoIndex}
                />
            )}

            <CreateSpotModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateSpot}
                clickedLocation={newSpotLocation}
            />

            {currentSpot && (
                <AddPhotoModal
                    open={showAddPhotoModal}
                    onClose={() => setShowAddPhotoModal(false)}
                    spotId={currentSpot.id}
                    onUploadSuccess={() => {
                        setRefreshTrigger(prev => prev + 1);
                    }}
                />
            )}
        </div>
    );
}