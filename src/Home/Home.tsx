import { Body } from "../Body/Body";
import { useEffect, useState } from "react";
import { fetchAllTags } from "../tags/TagService";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const [tagData, setTagData] = useState<{name: string, imageUrl: string}[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTagsWithPhotos = async () => {
            const tags = await fetchAllTags();
            
            const data = await Promise.all(tags.map(async (tag) => {
                const spotsRes = await fetch(`http://localhost:8080/spots/tag?tagName=${tag}`);
                const spots = await spotsRes.json();
                
                let imageUrl = ""; 
                if (spots.length > 0) {
                    const photoRes = await fetch(`http://localhost:8080/photos/spot/${spots[0].id}`);
                    const photos = await photoRes.json();
                    if (photos.length > 0) imageUrl = photos[0].url;
                }
                
                return { name: tag, imageUrl };
            }));
            
            setTagData(data.filter(tag => tag.imageUrl !== ""));
        };

        loadTagsWithPhotos();
    }, []);

    return (
        <div className="home-container">
            <Body />
            <section className="discover-section">
                <h2>Odkryj coś nowego</h2>
                <div className="category-grid">
                    {tagData.map(tag => (
                        <div 
                            key={tag.name} 
                            className="category-card"
                            style={{ 
                                backgroundImage: tag.imageUrl ? `url(${tag.imageUrl})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                            onClick={() => navigate(`/odkrywaj/${tag.name}`)}
                        >
                            <div className="category-overlay">
                                <h3>{tag.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}