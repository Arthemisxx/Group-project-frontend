import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "./Map.css";
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import {useMap} from 'react-leaflet'
import {OpenStreetMapProvider, GeoSearchControl} from 'leaflet-geosearch'
import {useEffect, useState} from "react";
import type Spot from "./Spot.ts";
// import {fetchSpotsData} from "./api.ts";
import testSpots from './testSpots.json'


interface SearchProps {
    provider: OpenStreetMapProvider; // Możesz doprecyzować jeśli dodasz typy z biblioteki
}

const Search = ({ provider }: SearchProps) => {
    const map = useMap();

    useEffect((): () => void => {
        // @ts-ignore
        const searchControl = new GeoSearchControl({
            provider,
            style: 'bar',
            showMarker: true,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            autoComplete: true,
            searchLabel: 'Wyszukaj miejsce...',

        });

        map.addControl(searchControl)
        return () => {
            map.removeControl(searchControl);
        };

    }, [map, provider])



    return null // don't want anything to show up from this comp
}



export const Map = () => {
    const [spots, setSpots] = useState<null | Spot[]>()

    useEffect(() => {
        const init = async() => {
            // const response: Spot[] = await fetchSpotsData();
            // const response = testSpots;
            // setSpots(response as Spot[]);

            setSpots(testSpots as Spot[]);


        }
        init();
    }, [spots]);

    return (
        <>
            <div className={"map-wrapper"}>
                <MapContainer center={[51.505, -0.09]} zoom={14} scrollWheelZoom={true}
                              style={{height: '100%', width: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    />
                    {spots?.map(spot => (
                        <Marker key={spot.id}
                                position={[spot.latitude, spot.longitude]}>
                            <Popup>
                                <strong>{spot.title}</strong>
                                <br />
                                {spot.description}
                            </Popup>

                        </Marker>
                    ))}
                    <Search provider={new OpenStreetMapProvider()}/>
                </MapContainer>

            </div>
        </>
    );
};