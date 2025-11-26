import './Explore.css';

// Przykładowe dane, aby odwzorować układ z Figmy
// W przyszłości podmienisz to na dane z API
const exploreItems = [
    { id: 1, height: 300, color: '#a8d5c3', title: 'Abstract Green' }, // Krótki
    { id: 2, height: 200, color: '#9dc5d8', title: 'Blue Abstract' }, // Bardzo krótki
    { id: 3, height: 400, color: '#d4cfb0', title: 'Gradient Mesh' }, // Wysoki
    { id: 4, height: 350, color: '#7fb7be', title: 'Teal Waves' },
    { id: 5, height: 250, color: '#a2d2ff', title: 'Soft Blur' },
    { id: 6, height: 380, color: '#84dcc6', title: 'Green Dots' },
    { id: 7, height: 320, color: '#b8e0d2', title: 'Pastel Vibes' },
    { id: 8, height: 280, color: '#95b8d1', title: 'Cold Blue' },
    { id: 9, height: 410, color: '#eac4d5', title: 'Pink Haze' },
];

export const Explore = () => {
    return (
        <section className="explore-container">
            <div className="explore-header">
                <h2>Highlight what’s great in pictures</h2>
                <p>This is what makes these images special.</p>
            </div>

            <div className="masonry-grid">
                {exploreItems.map((item) => (
                    <div key={item.id} className="grid-item">
                        {/* Tutaj symuluję obrazek div-em z kolorem,
                           żeby wyglądało jak na Twoim screenie "abstract".
                           Docelowo będzie tu tag <img src={item.url} />
                        */}
                        <div
                            className="image-placeholder"
                            style={{
                                height: `${item.height}px`,
                                background: `linear-gradient(15deg, ${item.color} 0%, #ffffff 100%)`
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        </section>
    );
};