import './MapView.css';
import {Map} from "./components/Map.tsx"
import {GoogleButton} from "./components/GoogleButton.tsx";
import {useState} from "react";
import type {Spot} from "../Utils/Spot.ts";

export const MapView = () =>  {
    const [currentSpot, setCurrentSpot] = useState<Spot | null>(null)

    function handleDataFromMap(spot: Spot | null){
        setCurrentSpot(spot)
    }



    return (

        <div className={"map-view-wrapper"}>


            <div className={"info-view"}>
                {currentSpot? (
                    <>
                        <div className={"photos-info-wrapper"}>
                            <div className={"photo-wrapper"}>

                                <img src="/photo1.jpg" alt="" className={"spot-photo"}/>
                            </div>
                            <div className={"photo-info-wrapper"}>
                                <p className={"tags"}>#krajobraz #windows #hasztag</p>

                            </div>

                        </div>
                        <div className={"spot-info-wrapper"}>
                            <p className={"spot-name"}>{currentSpot?.title}</p>
                            <p className={"label"}>Opis</p>
                            <p className={"descr"}>{currentSpot?.description}</p>


                        </div>
                        <GoogleButton lat={currentSpot?.latitude} long={currentSpot?.longitude}/></>

            ): (
                <>
                    <div><h1>TODO</h1></div>



                </>
            )}


        </div>

    <div className={"map-view"}>
        <Map sendDataToMapView={handleDataFromMap}/>
    </div>


</div>
)
    ;
}