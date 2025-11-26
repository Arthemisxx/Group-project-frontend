import './GoogleButton.css'

interface GoogleButtonProps {
    lat: number | undefined
    long: number | undefined;
}

export const GoogleButton = ({lat, long} : GoogleButtonProps) => {
    const url : string = `https://maps.google.com/?q=${lat},${long}`;

    if(lat == undefined || long == undefined){
        return null
    }else{
        return (
            <>
                <a href={url} target="_blank" className={"btn-wrapper"}>
                    <button className={"google-btn"}><img src="/googleMaps.png" alt="google maps logo"
                                                          className={"maps-logo"}/> <p>Otwórz w Google Maps</p></button>

                </a>
            </>
        );
    }


};