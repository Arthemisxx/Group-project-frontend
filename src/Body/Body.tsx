import './Body.css';

export const Body = () => {
    return (
        <main className="hero-section">
            <div className="hero-content">
                <h1>Nieznane miejsca czekają</h1>
                <p className="subtitle">
                    Od ukrytych perełek miejskich po spektakularne widoki natury.
                </p>
                <p>
                    Znajdź, zaplanuj i uchwyć idealne miejsce na Twoje następne zdjęcie. Koniec z szukaniem!
                </p>

                <div className="search-bar">
                    <input
                    type="text"
                    placeholder="Gdzie chcesz zacząć swoją przygodę?"
                    />
                    <button className="search-button" aria-label="Wyszukaj">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </main>
    );
};