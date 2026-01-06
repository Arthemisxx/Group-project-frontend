import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import EditProfileModal, { type UserData } from './EditProfileModal';
import { SpotModal } from '../Spot/SpotModal';
import axiosClient from '../Auth/axiosClient';
import { fetchSpotPhotos, fetchComments, insertComment } from '../Utils/api';
import type { Spot } from '../Utils/Spot';
import type { Photo } from '../Utils/Photo';
import type { Comment } from '../Utils/Comment';
import { useAuth } from '../Auth/AuthProvider.tsx';  // <- DODAJ IMPORT

interface FullUserProfile extends UserData {
    id: number;
    email: string;
    username: string;
    role: number;
    enabled: boolean;
    createdAt: string;
}

interface SpotItem {
    id: number;
    title: string;
    img?: string;
}

interface PhotoItem {
    id: number;
    url?: string;
    likes?: number;
    spotId: number;
}

type CardItem = SpotItem | PhotoItem;
type TabType = 'spots' | 'photos' | 'saved';

const User = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();  // <- DODAJ TO

    const [user, setUser] = useState<FullUserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [spots, setSpots] = useState<SpotItem[]>([]);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [saved, setSaved] = useState<SpotItem[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('spots');
    const [isEditing, setIsEditing] = useState(false);

    const [isSpotModalOpen, setSpotModalOpen] = useState(false);
    const [fullSpot, setFullSpot] = useState<Spot | null>(null);
    const [spotPhotos, setSpotPhotos] = useState<Photo[]>([]);
    const [spotComments, setSpotComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const meRes = await axiosClient.get('/users/me');
                const meData = meRes.data;

                const allRes = await axiosClient.get('/users/');
                const allUsers = allRes.data as FullUserProfile[];

                const fullProfile = allUsers.find((u) =>
                    (u.email === meData.email) ||
                    (u.email === meData.username) ||
                    (u.username === meData.username)
                );

                if (fullProfile) {
                    setUser(fullProfile);
                } else {
                    setUser(meData as FullUserProfile);
                }

                try {
                    const sR = await axiosClient.get('/users/me/spots');
                    const rawSpots = sR.data as SpotItem[];

                    const spotsWithImages = await Promise.all(rawSpots.map(async (spot: SpotItem) => {
                        try {
                            const photos = await fetchSpotPhotos(spot.id);
                            if (photos && photos.length > 0) {
                                return { ...spot, img: photos[0].url };
                            }
                        } catch {

                        }
                        return spot;
                    }));
                    setSpots(spotsWithImages);
                } catch (e) { console.error(e); }

                try {
                    const pR = await axiosClient.get('/users/me/photos');
                    setPhotos(pR.data as PhotoItem[]);
                } catch (e) { console.error(e); }

                try {
                    const svR = await axiosClient.get('/users/me/saved');
                    const rawSaved = svR.data as SpotItem[];

                    const savedWithImages = await Promise.all(rawSaved.map(async (spot: SpotItem) => {
                        try {
                            const photos = await fetchSpotPhotos(spot.id);
                            if (photos && photos.length > 0) {
                                return { ...spot, img: photos[0].url };
                            }
                        } catch {

                        }
                        return spot;
                    }));
                    setSaved(savedWithImages);
                } catch (e) { console.error(e); }

            } catch (err: unknown) {
                console.error(err);
                if (typeof err === 'object' && err !== null && 'response' in err) {
                    const axiosError = err as { response: { status: number } };
                    if (axiosError.response.status === 401) {
                        navigate('/');
                        return;
                    }
                }
                setError('Nie udało się załadować profilu.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [navigate]);

    const handleUpdateProfile = async (updatedData: Partial<UserData>) => {
        try {
            const response = await axiosClient.put('/users/me', updatedData);
            setUser(prev => prev ? { ...prev, ...response.data } : null);
        } catch (err) {
            console.error(err);
            alert("Nie udało się zapisać zmian.");
        }
    };

    const handleOpenSpot = async (spotId: number) => {
        try {
            const spotRes = await axiosClient.get<Spot>(`/spots/${spotId}`);
            const [photosData, commentsData] = await Promise.all([
                fetchSpotPhotos(spotId),
                fetchComments(spotId)
            ]);

            setFullSpot(spotRes.data);
            setSpotPhotos(photosData);
            setSpotComments(commentsData);
            setSpotModalOpen(true);
        } catch (error) {
            console.error(error);
            alert("Nie udało się załadować szczegółów miejsca.");
        }
    };

    const handleAddComment = async (content: string) => {
        if (!fullSpot) return;
        try {
            await insertComment({
                content: content,
                spotId: fullSpot.id,
                photoId: 0
            });
            const refreshedComments = await fetchComments(fullSpot.id);
            setSpotComments(refreshedComments);
        } catch (error) {
            console.error(error);
            alert("Nie udało się dodać komentarza.");
        }
    };

    // <- DODAJ FUNKCJĘ WYLOGOWANIA
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getAvatarSrc = (url: string | null | undefined) => {
        if (!url) return `https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random`;
        if (url.startsWith('/uploads')) return `http://localhost:8080${url}`;
        return url;
    };

    const getHeaderStyle = (id: number) => {
        const gradients = [
            'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
            'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
            'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
            'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)'
        ];
        const svgPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E`;
        return { backgroundImage: `url("${svgPattern}"), ${gradients[id % gradients.length]}`, backgroundBlendMode: 'overlay' };
    };

    const renderCard = (type: 'spot' | 'photo', item: CardItem) => {
        let imageUrl: string | undefined;
        let titleText: string = 'Photo';

        const BACKEND_URL = 'http://localhost:8080';

        if (type === 'spot') {
            const spot = item as SpotItem;
            titleText = spot.title;

            if (spot.img) {
                imageUrl = spot.img.startsWith('/') ? `${BACKEND_URL}${spot.img}` : spot.img;
            }
        } else {
            const photo = item as PhotoItem;
            titleText = 'Zdjęcie';
            if (photo.url) {
                imageUrl = photo.url.startsWith('/') ? `${BACKEND_URL}${photo.url}` : photo.url;
            }
        }

        const hasImage = imageUrl && imageUrl.trim() !== "";

        return (
            <div
                key={item.id}
                className={`media-card ${type}-card`}
                onClick={() => {
                    if (type === 'spot') {
                        handleOpenSpot(item.id);
                    } else {
                        const photo = item as PhotoItem;
                        if (photo.spotId) {
                            handleOpenSpot(photo.spotId);
                        } else {
                            console.warn("Brak spotId w zdjęciu");
                        }
                    }
                }}
                style={{ cursor: 'pointer' }}
            >
                <div className="card-media-wrapper">
                    {hasImage ? (
                        <img src={imageUrl} alt={titleText} loading="lazy" className="card-img-real"/>
                    ) : (
                        <div className={`placeholder-topo ${type === 'spot' ? 'topo-spot' : 'topo-photo'}`}>
                            <span className="placeholder-badge">{type === 'spot' ? 'SPOT' : 'FOTO'}</span>
                        </div>
                    )}
                    {type === 'photo' && hasImage && (
                        <div className="photo-overlay"><span>❤️ {(item as PhotoItem).likes || 0}</span></div>
                    )}
                </div>
                {type === 'spot' && (
                    <div className="card-details-row">
                        <h3 className="card-title truncate">{titleText}</h3>
                        <button
                            className="card-action-btn"
                            title="Pokaż na mapie"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/mapa', { state: { focusSpotId: item.id } });
                            }}
                        >
                            📍
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderTabContent = () => {
        let currentList: CardItem[] = [];
        let emptyMessage = "";
        let cardType: 'spot' | 'photo' = 'spot';

        if (activeTab === 'spots') {
            currentList = spots; emptyMessage = "Brak dodanych miejscówek."; cardType = 'spot';
        } else if (activeTab === 'photos') {
            currentList = photos; emptyMessage = "Galeria zdjęć jest pusta."; cardType = 'photo';
        } else if (activeTab === 'saved') {
            currentList = saved; emptyMessage = "Nic nie zapisano na później."; cardType = 'spot';
        }

        if (currentList.length === 0) return <div className="empty-state-box">{emptyMessage}</div>;

        return (
            <div className="grid-layout fade-in">
                {currentList.map((item) => renderCard(cardType, item))}
            </div>
        );
    };

    if (loading) return <div className="loading-screen">Ładowanie...</div>;
    if (error) return <div className="error-screen">⚠️ {error}</div>;
    if (!user) return null;

    return (
        <div className="profile-container-v2">
            <div className="profile-header-hero" style={getHeaderStyle(user.id || 0)}>
                <div className="header-content-inner">
                    <div className="avatar-wrapper-large">
                        <img src={getAvatarSrc(user.avatarUrl)} alt="Avatar" />
                    </div>
                    <div className="header-text">
                        <h1 className="header-display-name">{user.displayName || user.email}</h1>
                        <p className="header-username">@{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="main-layout-wrapper">
                <aside className="sticky-sidebar">
                    <div className="sidebar-card intro-card">
                        <h4 className="sidebar-heading">O mnie</h4>
                        <p className="bio-text">{user.bio || 'Użytkownik nie dodał jeszcze opisu.'}</p>
                        <button className="btn-primary-outline" onClick={() => setIsEditing(true)}>
                            Edytuj profil
                        </button>

                        {/* <- DODAJ PRZYCISK WYLOGUJ */}
                        <button
                            className="btn-logout"
                            onClick={handleLogout}
                            style={{
                                marginTop: '10px',
                                width: '100%',
                                padding: '10px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#c82333'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#dc3545'}
                        >
                            Wyloguj się
                        </button>
                    </div>

                    <div className="sidebar-card stats-card">
                        <h4 className="sidebar-heading">Aktywność</h4>
                        <div className="stats-grid">
                            <div className="stat-item"><span className="stat-icon">🗺️</span><strong className="stat-num">{spots.length}</strong><span className="stat-label">Spoty</span></div>
                            <div className="stat-item"><span className="stat-icon">📸</span><strong className="stat-num">{photos.length}</strong><span className="stat-label">Zdjęcia</span></div>
                            <div className="stat-item"><span className="stat-icon">🔖</span><strong className="stat-num">{saved.length}</strong><span className="stat-label">Zapisane</span></div>
                        </div>
                    </div>
                </aside>

                <main className="content-area">
                    <div className="pills-nav-container">
                        <nav className="pills-nav">
                            <button className={activeTab === 'spots' ? 'active' : ''} onClick={() => setActiveTab('spots')}>Miejsca <span className="pill-count">{spots.length}</span></button>
                            <button className={activeTab === 'photos' ? 'active' : ''} onClick={() => setActiveTab('photos')}>Zdjęcia <span className="pill-count">{photos.length}</span></button>
                            <button className={activeTab === 'saved' ? 'active' : ''} onClick={() => setActiveTab('saved')}>Zapisane <span className="pill-count">{saved.length}</span></button>
                        </nav>
                    </div>
                    {renderTabContent()}
                </main>
            </div>

            {isEditing && user && (
                <EditProfileModal
                    open={isEditing}
                    user={user}
                    onClose={() => setIsEditing(false)}
                    onSave={handleUpdateProfile}
                />
            )}

            {isSpotModalOpen && fullSpot && (
                <SpotModal
                    open={isSpotModalOpen}
                    onClose={() => setSpotModalOpen(false)}
                    spot={fullSpot}
                    photos={spotPhotos}
                    comments={spotComments}
                    onAddComment={handleAddComment}
                />
            )}
        </div>
    );
};

export default User;