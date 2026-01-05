import "./SpotModal.css";
import type { Photo } from "../Utils/Photo.ts";
import type { Spot } from "../Utils/Spot.ts";
import { GoogleButton } from "../Map/components/GoogleButton.tsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import {FaChevronLeft, FaChevronRight, FaPaperPlane, FaUserCircle} from "react-icons/fa";
import type {Comment} from "../Utils/Comment.ts";
import {AddPhotoButton} from "./Photos/AddPhotoButton.tsx";
import {AddPhotoModal} from "./Photos/AddPhotoModal.tsx";
import {fetchSpotPhotos} from "../Utils/api.ts";
import {EditSpotButton} from "./EditSpotButton.tsx";
import {EditSpotModal} from "./EditSpotModal.tsx";
import {useAuth} from "../Auth/AuthProvider.tsx";
import { jwtDecode } from "jwt-decode";

interface ModalProps {
    onClose: () => void;
    open: boolean;
    spot: Spot;
    photos: Photo[];
    comments: Comment[];
    onAddComment: (content: string) => void;
    initialPhotoIndex?: number;
}



function getPhotoUrl(url: string): string {
    if (url.includes("drive.google.com")) {
        const id = url.substring(url.indexOf("/d/") + 3, url.indexOf("/view?"));
        return `https://drive.google.com/thumbnail?id=${id}`;
    } else {
        return url;
    }
}

const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div className="modal-arrow next" onClick={onClick}>
            <FaChevronRight />
        </div>
    );
};

const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div className="modal-arrow prev" onClick={onClick}>
            <FaChevronLeft />
        </div>
    );
};

export const SpotModal = ({ open, onClose, spot, photos, comments, onAddComment, initialPhotoIndex = 0 }: ModalProps) => {
    const [activeSlide, setActiveSlide] = useState(initialPhotoIndex);
    const [newComment, setNewComment] = useState("");
    const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
    const [spotPhotos, setSpotPhotos] = useState<Photo[]>(photos)
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentSpot, setCurrentSpot] = useState(spot);
    const {token} = useAuth();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (open) {
            setSpotPhotos(photos);
            setActiveSlide(initialPhotoIndex);
            setCurrentSpot(spot);

            if (token && spot.author) {
                try {
                    const decoded: any = jwtDecode(token);
                    const currentUserId = decoded.id || decoded.sub || decoded.userId;

                    console.log("Token ID:", currentUserId, "Type:", typeof currentUserId);
                    console.log("Spot Author ID:", spot.author.id, "Type:", typeof spot.author.id);
                    console.log("Token: ", decoded)

                    if (currentUserId && String(currentUserId) === String(spot.author.id)) {
                        setIsOwner(true);
                    } else {
                        setIsOwner(false);
                    }
                } catch (error) {
                    console.error("Błąd dekodowania tokena:", error);
                    setIsOwner(false);
                }
            } else {
                setIsOwner(false);
            }
        }
    }, [photos, open, initialPhotoIndex, spot, token]);

    const handleRefreshPhotos = async () => {
        try {
            const response = await fetchSpotPhotos(spot.id);
            if (response) {
                setSpotPhotos(response as Photo[]);
            }
        } catch (error) {
            console.error("Błąd odświeżania zdjęć:", error);
        }
    }

    const handleSendComment = () => {
        if (newComment.trim().length > 0) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    if (!open) return null;

    const settings = {
        dots: true,
        infinite: spotPhotos.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: initialPhotoIndex,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        afterChange: (current: number) => setActiveSlide(current),
        adaptiveHeight: false,
    };

    const currentPhoto = spotPhotos[activeSlide];

    return (
        <div className="modal display-block" onClick={onClose}>
            <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>

                <div className="modal-photo-wrapper">
                    {spotPhotos.length > 0 && (
                        <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 20 }}>
                            <AddPhotoButton onClick={() => setShowAddPhotoModal(true)} />
                        </div>
                    )}
                    {spotPhotos.length > 0 ? (
                        <Slider {...settings} className="modal-slider">
                            {spotPhotos.map((photo) => (
                                <div key={photo.id} className="modal-slide-container">
                                    <img
                                        src={getPhotoUrl(photo.url)}
                                        alt={photo.caption || "Spot photo"}
                                        className="modal-photo"
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="no-photos-placeholder">
                            <div style={{marginTop: '15px'}}>
                                <AddPhotoButton onClick={() => setShowAddPhotoModal(true)} className={"add-photo-button-modal"}/>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-info">
                    <div className="spot-header-section">
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            paddingBottom: '10px',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '10px'
                        }}>
                            <h2 className="spot-title">{currentSpot.title}</h2>
                            {isOwner && (
                                <EditSpotButton onClick={() => setShowEditModal(true)} />
                            )}
                        </div>
                        <div className="section">
                            <p className="label">O miejscu</p>
                            <p className="spot-description">{currentSpot.description}</p>
                        </div>
                    </div>

                    <div className="divider"></div>

                    {currentPhoto && (
                        <div className="photo-details-section">
                            <div className="photo-counter">
                                Zdjęcie {activeSlide + 1} z {spotPhotos.length}
                            </div>

                            <div className="section">
                                <p className="label">Opis zdjęcia</p>
                                <p className="photo-caption">
                                    {currentPhoto.caption || "Brak opisu zdjęcia."}
                                </p>
                            </div>

                            <div className="section">
                                <p className="label">Autor zdjęcia</p>
                                <div className="photo-author-row">
                                    {/* TODO można dodać awatara autora */}
                                    <p className="photo-author">{currentPhoto.author?.displayName}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="divider"></div>

                    <div className="modal-comments-section">
                        <h3 className="comments-title">Komentarze ({comments.length})</h3>

                        <div className="modal-comments-list">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="modal-comment">
                                        <div className="comment-avatar">
                                            <FaUserCircle/>
                                        </div>
                                        <div className="comment-body">
                                            <div className="comment-header">
                                                <span
                                                    className="comment-author-name">{comment.author.displayName}</span>
                                                <span className="comment-date">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="comment-text">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-comments-text">Bądź pierwszy i skomentuj to miejsce!</p>
                            )}
                        </div>

                        <div className="add-comment-wrapper">
                            <textarea
                                className="comment-input"
                                placeholder="Dodaj komentarz..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={2}
                            />
                            <button
                                className="send-comment-btn"
                                onClick={handleSendComment}
                                disabled={newComment.trim().length === 0}
                            >
                                <FaPaperPlane/>
                            </button>
                        </div>
                    </div>

                    <div className="section google-btn-wrapper">
                        <GoogleButton lat={spot.latitude} long={spot.longitude}/>
                    </div>
                </div>

                <button onClick={onClose} className="modal-close-icon">✕</button>
            </div>


                <AddPhotoModal
                    open={showAddPhotoModal}
                    onClose={() => setShowAddPhotoModal(false)}
                    spotId={spot.id}
                    onUploadSuccess={() => {
                        handleRefreshPhotos();
                    }}
                />

            <EditSpotModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                spot={currentSpot}
                photos={spotPhotos}
                onSpotUpdated={(updated) => setCurrentSpot(updated)}
                onPhotosUpdated={handleRefreshPhotos}
            />
        </div>


    );
};