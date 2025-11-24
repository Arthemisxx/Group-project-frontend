import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "./Map.css";
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import {useMap} from 'react-leaflet'
import {OpenStreetMapProvider, GeoSearchControl} from 'leaflet-geosearch'
import {useEffect, useState} from "react";
import type {Spot} from "../../Utils/Spot.ts";
import {fetchSpotsData} from "../../Utils/api.ts";


interface SearchProps {
    provider: OpenStreetMapProvider;
}

const Search = ({provider}: SearchProps) => {
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

    return null
};

// @ts-ignore
const MapController = ({onMapReady}) => {
    const map = useMap();

    useEffect(() => {
        onMapReady(map);
    }, [map]);

    return null;
};


interface MapProps {
    sendDataToMapView: (spot: Spot | null) => void
}

export const Map = ({sendDataToMapView}: MapProps) => {
    const [spots, setSpots] = useState<null | Spot[]>()
    const [userLocation, setUserLocation] = useState<[number, number]>([52.237049, 21.017532]);
    const [mapInstance, setMapInstance] = useState(null);
    const [currentSpot, setCurrentSpot] = useState<Spot | null>(null)


    useEffect(() => {
            sendDataToMapView(currentSpot);
   
    }, [currentSpot, sendDataToMapView]);
    
    useEffect(() => {
        const init = async () => {
            let response: Spot[] = [];
            response = await fetchSpotsData(-90, 90, -180, 180);
            setSpots(response as Spot[]);
        }
        init();
    }, []);

    const findUser = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                    const {latitude, longitude} = position.coords;
                    setUserLocation([latitude, longitude]);

                }, (error) => {
                    console.error('Error getting user location:', error);
                }
            );
        }
    }


    const findUserLocation = () => {
        if (!mapInstance) return;

        findUser();

        // @ts-ignore
        mapInstance.flyTo(userLocation, 14);
    };


    return (
        <>
            <div className={"map-wrapper"}>
                <button className={"user-localization"} onClick={findUserLocation}><img src="public/my-location.svg"
                                                                                 alt="My location"/></button>
                <MapContainer center={userLocation} zoom={7} scrollWheelZoom={true}
                              style={{height: '100%', width: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    />
                    <MapController onMapReady={setMapInstance}/>
                    {spots?.map(spot => (
                        <Marker key={spot.id}
                                position={[spot.latitude, spot.longitude]} eventHandlers={{
                            click: () => {
                                setCurrentSpot(spot);
                                console.log(spot)
                            }
                        }} >
                            {/*<Popup>*/}
                            {/*    <strong>{spot.title}</strong>*/}
                            {/*    <br/>*/}
                            {/*    {spot.description}*/}
                            {/*</Popup>*/}

                        </Marker>
                    ))}
                    <Search provider={new OpenStreetMapProvider()}/>
                </MapContainer>

            </div>
        </>
    );
};