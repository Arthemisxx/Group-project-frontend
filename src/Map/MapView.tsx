import './MapView.css';
import {Map} from "./components/Map.tsx"
import {GoogleButton} from "./components/GoogleButton.tsx";

export const MapView = () =>  {
    return (
        <div className={"map-view-wrapper"}>
            <div className={"info-view"}>
                <div className={"photos-info-wrapper"}>
                    <div className={"photo-wrapper"}>

                        <img src="/photo1.jpg" alt="" className={"spot-photo"}/>
                    </div>
                    <div className={"photo-info-wrapper"}>
                        <p className={"tags"}>#krajobraz #windows #hasztag</p>

                    </div>

                </div>
                <div className={"spot-info-wrapper"}>
                    <p className={"spot-name"}>Górskie jezioro</p>
                    <p className={"label"}>Opis</p>
                    <p className={"descr"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sagittis eget tortor a cursus. Maecenas porttitor, leo cursus vestibulum fringilla, ex nisi tincidunt lacus, eget finibus felis</p>



                </div>
                <GoogleButton lat={"49.2827"} long={"19.9450"}/>


            </div>

            <div className={"map-view"}>
                <Map/>
            </div>


        </div>
    );
}