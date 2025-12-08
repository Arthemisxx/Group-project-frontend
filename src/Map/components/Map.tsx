import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "./Map.css";
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import {useMap} from 'react-leaflet'
import {OpenStreetMapProvider, GeoSearchControl} from 'leaflet-geosearch'
import {useEffect, useState} from "react";
import type {Spot} from "../../Utils/Spot.ts";
import type {Photo} from "../../Utils/Photo.ts";
import {fetchSpotPhotos, fetchSpotsData} from "../../Utils/api.ts";


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
    sendSpotDataToMapView: (spot: Spot | null) => void;
    sendPhotosDataToMapView: (photos: Photo[]) => void
}

export const Map = ({sendSpotDataToMapView, sendPhotosDataToMapView}: MapProps) => {
    const [spots, setSpots] = useState<null | Spot[]>()
    const [photos, setPhotos] = useState<Photo[]>([])
    const [userLocation, setUserLocation] = useState<[number, number]>([51.777024, 19.486368]);
    const [mapInstance, setMapInstance] = useState(null);
    const [currentSpot, setCurrentSpot] = useState<Spot | null>(null)


    useEffect(() => {
            sendSpotDataToMapView(currentSpot);
   
    }, [currentSpot, sendSpotDataToMapView]);

    useEffect(() => {
        sendPhotosDataToMapView(photos)

    }, [photos, sendPhotosDataToMapView]);
    
    useEffect(() => {
        const init = async () => {
            let response: Spot[] = [];
            response = await fetchSpotsData(-90, 90, -180, 180);
            setSpots(response as Spot[]);

        }
        init();
    }, []);

    const getPhotos = async (id :number) => {
        let response: Photo[] = [];
        response = await fetchSpotPhotos(id);
        setPhotos(response as Photo[])
    }

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
        findUser();
        console.log(userLocation)

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
                                getPhotos(spot.id);
                            }
                        }} >

                        </Marker>
                    ))}
                    <Search provider={new OpenStreetMapProvider()}/>
                </MapContainer>

            </div>
        </>
    );
};