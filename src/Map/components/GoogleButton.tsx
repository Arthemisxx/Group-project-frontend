import './GoogleButton.css'

interface GoogleButtonProps {
    lat: string;
    long: string;
}

export const GoogleButton = ({lat, long} : GoogleButtonProps) => {
    const url : string = `https://maps.google.com/?q=${lat},${long}`;

    return (
        <>
            <a href={url} target="_blank" className={"btn-wrapper"}>
                <button className={"google-btn"}><img src="/googleMaps.png" alt="google maps logo"
                                                      className={"maps-logo"}/> <p>Otwórz w Google Maps</p></button>

            </a>
        </>
    );
};