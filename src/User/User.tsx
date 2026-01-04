import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import EditProfileModal from './EditProfileModal';

interface UserData {
    id: number;
    username: string;
    email: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
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
}

type CardItem = SpotItem | PhotoItem;
type TabType = 'spots' | 'photos' | 'saved';

const User = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [spots, setSpots] = useState<SpotItem[]>([]);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [saved, setSaved] = useState<SpotItem[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('spots');

    const [isEditing, setIsEditing] = useState(false);

    const API_URL = 'http://localhost:8080/users';

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Brak tokena.');

                const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

                const meRes = await fetch(`${API_URL}/me`, { headers });

                if (!meRes.ok) {
                    if (meRes.status === 401 || meRes.status === 403 || meRes.status === 500) {
                        localStorage.removeItem('token');
                        navigate('/');
                        return;
                    }
                    throw new Error('Nie udało się pobrać danych sesji.');
                }
                const meData = await meRes.json();

                const allRes = await fetch(`${API_URL}/`, { headers });
                if (!allRes.ok) throw new Error('Błąd pobierania użytkowników.');

                const allUsers: unknown = await allRes.json();

                if (Array.isArray(allUsers)) {
                    const usersTyped = allUsers as UserData[];
                    const fullProfile = usersTyped.find((u) => u.email === meData.email);

                    if (fullProfile) setUser(fullProfile);
                    else throw new Error('Nie znaleziono profilu na liście użytkowników.');
                } else {
                    throw new Error('Błędny format danych z serwera.');
                }

                try {
                    const sR = await fetch(`${API_URL}/me/spots`, { headers });
                    if(sR.ok) setSpots(await sR.json());
                } catch (e) { console.error(e); }

                try {
                    const pR = await fetch(`${API_URL}/me/photos`, { headers });
                    if(pR.ok) setPhotos(await pR.json());
                } catch (e) { console.error(e); }

                try {
                    const svR = await fetch(`${API_URL}/me/saved`, { headers });
                    if(svR.ok) setSaved(await svR.json());
                } catch (e) { console.error(e); }

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Wystąpił nieznany błąd');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [navigate]);

    const handleUpdateProfile = async (updatedData: Partial<UserData>) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error('Błąd aktualizacji profilu');

            const updatedUserFromServer = await response.json();
            setUser(prev => prev ? { ...prev, ...updatedUserFromServer } : null);

        } catch (err) {
            console.error(err);
            alert("Nie udało się zapisać zmian. Sprawdź konsolę.");
        }
    };

    const getHeaderStyle = (id: number) => {
        const gradients = [
            'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
            'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
            'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
            'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)'
        ];

        const svgPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

        return {
            backgroundImage: `url("${svgPattern}"), ${gradients[id % gradients.length]}`,
            backgroundBlendMode: 'overlay'
        };
    };

    const renderCard = (type: 'spot' | 'photo', item: CardItem) => {
        let imageUrl: string | undefined;
        let titleText: string = 'Photo';

        if (type === 'spot') {
            const spot = item as SpotItem;
            imageUrl = spot.img;
            titleText = spot.title;
        } else {
            const photo = item as PhotoItem;
            imageUrl = photo.url;
            titleText = 'Zdjęcie';
        }

        const hasImage = imageUrl && imageUrl.trim() !== "";

        return (
            <div key={item.id} className={`media-card ${type}-card`}>
                <div className="card-media-wrapper">
                    {hasImage ? (
                        <img
                            src={imageUrl}
                            alt={titleText}
                            loading="lazy"
                            className="card-img-real"
                        />
                    ) : (
                        <div className={`placeholder-topo ${type === 'spot' ? 'topo-spot' : 'topo-photo'}`}>
                            <span className="placeholder-badge">{type === 'spot' ? 'SPOT' : 'FOTO'}</span>
                        </div>
                    )}

                    {type === 'photo' && hasImage && (
                        <div className="photo-overlay">
                            <span>❤️ {(item as PhotoItem).likes || 0}</span>
                        </div>
                    )}
                </div>

                {type === 'spot' && (
                    <div className="card-details-row">
                        <h3 className="card-title truncate">{titleText}</h3>
                        <button className="card-action-btn">📍</button>
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
            currentList = spots;
            emptyMessage = "Brak dodanych miejscówek.";
            cardType = 'spot';
        } else if (activeTab === 'photos') {
            currentList = photos;
            emptyMessage = "Galeria zdjęć jest pusta.";
            cardType = 'photo';
        } else if (activeTab === 'saved') {
            currentList = saved;
            emptyMessage = "Nic nie zapisano na później.";
            cardType = 'spot';
        }

        if (currentList.length === 0) {
            return <div className="empty-state-box">{emptyMessage}</div>;
        }

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
            <div className="profile-header-hero" style={getHeaderStyle(user.id)}>
                <div className="header-content-inner">
                    <div className="avatar-wrapper-large">
                        <img
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                            alt="Avatar"
                        />
                    </div>
                    <div className="header-text">
                        <h1 className="header-display-name">{user.displayName || user.username}</h1>
                        <p className="header-username">@{user.username}</p>
                    </div>
                </div>
            </div>

            <div className="main-layout-wrapper">
                <aside className="sticky-sidebar">
                    <div className="sidebar-card intro-card">
                        <h4 className="sidebar-heading">O mnie</h4>
                        <p className="bio-text">{user.bio || 'Użytkownik nie dodał jeszcze opisu.'}</p>

                        <button
                            className="btn-primary-outline"
                            onClick={() => setIsEditing(true)}
                        >
                            Edytuj profil
                        </button>
                    </div>

                    <div className="sidebar-card stats-card">
                        <h4 className="sidebar-heading">Aktywność</h4>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-icon">🗺️</span>
                                <strong className="stat-num">{spots.length}</strong>
                                <span className="stat-label">Spoty</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">📸</span>
                                <strong className="stat-num">{photos.length}</strong>
                                <span className="stat-label">Zdjęcia</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-icon">🔖</span>
                                <strong className="stat-num">{saved.length}</strong>
                                <span className="stat-label">Zapisane</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="content-area">
                    <div className="pills-nav-container">
                        <nav className="pills-nav">
                            <button
                                className={activeTab === 'spots' ? 'active' : ''}
                                onClick={() => setActiveTab('spots')}
                            >
                                Miejsca <span className="pill-count">{spots.length}</span>
                            </button>
                            <button
                                className={activeTab === 'photos' ? 'active' : ''}
                                onClick={() => setActiveTab('photos')}
                            >
                                Zdjęcia <span className="pill-count">{photos.length}</span>
                            </button>
                            <button
                                className={activeTab === 'saved' ? 'active' : ''}
                                onClick={() => setActiveTab('saved')}
                            >
                                Zapisane <span className="pill-count">{saved.length}</span>
                            </button>
                        </nav>
                    </div>

                    {renderTabContent()}
                </main>
            </div>

            {isEditing && user && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditing(false)}
                    onSave={handleUpdateProfile}
                />
            )}
        </div>
    );
};

export default User;