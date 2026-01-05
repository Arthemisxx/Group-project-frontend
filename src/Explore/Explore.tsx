import { useState, useEffect } from 'react';
import './Explore.css';
import { SpotModal } from '../Spot/SpotModal';
import { fetchAllTags } from '../tags/TagService';
import { useSearchParams } from 'react-router-dom';

interface GroupedData {
    tagName: string;
    photos: any[];
}

export const Explore = () => {
    const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

const [searchParams] = useSearchParams();
    const filterTag = searchParams.get("tag");

    useEffect(() => {
        const loadGroupedPhotos = async () => {
            try {
                const allTags = await fetchAllTags();
                
                const tagsToLoad = filterTag ? [filterTag] : allTags;

                const results = await Promise.all(tagsToLoad.map(async (tag) => {
                    const spotsRes = await fetch(`http://localhost:8080/spots/tag?tagName=${tag}`);
                    const spots = await spotsRes.json();
                    
                    let allTagPhotos: any[] = [];
                    for (const spot of spots) {
                        const photoRes = await fetch(`http://localhost:8080/photos/spot/${spot.id}`);
                        const spotPhotos = await photoRes.json();
                        allTagPhotos = [...allTagPhotos, ...spotPhotos.map((p: any) => ({ ...p, spot }))];
                    }
                    return { tagName: tag, photos: allTagPhotos };
                }));

                setGroupedData(results.filter(group => group.photos.length > 0));
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        loadGroupedPhotos();
    }, [filterTag]);

    const handleCardClick = (photo: any) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    if (loading) return <div className="explore-loader">Ładowanie kategorii...</div>;

    return (
        <section className="explore-container">
            <div className="explore-header" style={{ padding: '20px 0' }}>
                <h2>Odkrywaj według kategorii</h2>
                <p>Przeglądaj najciekawsze zdjęcia pogrupowane tematycznie</p>
            </div>

            {groupedData.length > 0 ? (
                groupedData.map((group) => (
                    <div key={group.tagName} className="tag-section">
                        <h2 className="tag-section-title">{group.tagName}</h2>
                        <div className="tag-section-grid">
                            {group.photos.slice(0, 4).map((photo) => (
                                <div key={photo.id} className="grid-item" onClick={() => handleCardClick(photo)}>
                                    <img src={photo.url} alt="" className="grid-image" />
                                    <div className="grid-overlay">
                                        <h3 className="grid-title">{photo.spot?.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-data-warning" >
                    
                </div>
            )}

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
        </section>
    );
};