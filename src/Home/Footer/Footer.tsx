import './Footer.css';

export const Footer = () => {

    const authors = [
        "Julia Staniszewska", "Ewa Głowacka", "Bartosz Sędzikowski", "Kacper Okrasa",
        "Taras Priymachuk", "Szymon Toma", "Patryk Romaniuk", "Oliwier Lewandowski"
    ];

    return (
        <footer className={`footer-container `}>
            <div className="footer-content">

                <div className="footer-top">
                    <h3>Odkrywaj Więcej</h3>
                    <p>Twój przewodnik po nieznanych zakątkach świata.</p>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-team">
                    <h4>Zespół projektowy</h4>
                    <div className="authors-grid">
                        {authors.map((author, index) => (
                            <span key={index} className="author-name">
                                {author}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <p>
                        &copy; {new Date().getFullYear()} Wszystkie prawa zastrzeżone.
                    </p>

                </div>
            </div>
        </footer>
    );
};