import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "./Map.css";
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import {useMap} from 'react-leaflet'
import {OpenStreetMapProvider, GeoSearchControl} from 'leaflet-geosearch'
import {useEffect, useState} from "react";
import type {Spot} from "../../Utils/Spot.ts";
import type {Photo} from "../../Utils/Photo.ts";
import {fetchComments, fetchSpotPhotos, fetchSpotsData} from "../../Utils/api.ts";
import type {Comment} from "../../Utils/Comment.ts";
import L from 'leaflet';

const defaultIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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
    sendPhotosDataToMapView: (photos: Photo[]) => void;
    sendCommentsDataToMapView: (comments: Comment[]) => void;
    refreshTrigger: number;
    refreshSpots: number;
    flyToLocation: { lat: number; lng: number } | null;
    searchQuery?: string;
}

export const Map = ({
                        sendSpotDataToMapView,
                        sendPhotosDataToMapView,
                        sendCommentsDataToMapView,
                        refreshTrigger,
                        refreshSpots,
                        flyToLocation,
                        searchQuery
                    }: MapProps) => {
    const [spots, setSpots] = useState<null | Spot[]>()
    const [photos, setPhotos] = useState<Photo[]>([])
    const [userLocation, setUserLocation] = useState<[number, number]>([51.777024, 19.486368]);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [currentSpot, setCurrentSpot] = useState<Spot | null>(null)
    const [currentSpotComments, setCurrentSpotComments] = useState<Comment[]>([])

    useEffect(() => {
        sendSpotDataToMapView(currentSpot);
    }, [currentSpot, sendSpotDataToMapView]);

    useEffect(() => {
        sendPhotosDataToMapView(photos)
    }, [photos, sendPhotosDataToMapView]);

    useEffect(() => {
        sendCommentsDataToMapView(currentSpotComments)
    }, [currentSpotComments, sendCommentsDataToMapView]);

    useEffect(() => {
        if (mapInstance && flyToLocation) {
            mapInstance.flyTo([flyToLocation.lat, flyToLocation.lng], 12, {
                duration: 1.5
            });
        }
    }, [mapInstance, flyToLocation]);

    // NOWE - automatyczne wpisanie w search bar
    useEffect(() => {
        if (mapInstance && searchQuery) {
            setTimeout(() => {
                const searchInput = document.querySelector('.leaflet-control-geosearch form input') as HTMLInputElement;
                if (searchInput) {
                    // Wpisz tekst
                    searchInput.value = searchQuery;
                    searchInput.focus();

                    // Pokaż że zostało wyszukane
                    console.log('Wpisano w search bar:', searchQuery);
                }
            }, 1500);
        }
    }, [mapInstance, searchQuery]);

    useEffect(() => {
        const loadSpots = async () => {
            try {
                const response = await fetchSpotsData(-90, 90, -180, 180);
                setSpots(response);
            } catch (e) {
                console.error("Błąd pobierania spotów:", e);
            }
        };

        loadSpots();
    }, [refreshSpots]);

    useEffect(() => {
        if (currentSpot) {
            getComments(currentSpot.id);
            getPhotos(currentSpot.id);
        }
    }, [currentSpot, refreshTrigger]);

    const getPhotos = async (id: number) => {
        let response: Photo[] = [];
        response = await fetchSpotPhotos(id);
        setPhotos(response as Photo[])
    }

    const getComments = async (id: number) => {
        let response: Comment[] = [];
        response = await fetchComments(id);
        setCurrentSpotComments(response as Comment[])
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

        mapInstance.flyTo(userLocation, 14);
    };

    return (
        <>
            <div className={"map-wrapper"}>
                <button className={"user-localization"} onClick={findUserLocation}>
                    <img src="public/my-location.svg" alt="My location"/>
                </button>
                <MapContainer
                    center={userLocation}
                    zoom={7}
                    scrollWheelZoom={true}
                    style={{height: '100%', width: '100%'}}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    />
                    <MapController onMapReady={setMapInstance}/>
                    {spots?.map(spot => (
                        <Marker
                            key={spot.id}
                            position={[spot.latitude, spot.longitude]}
                            icon={currentSpot?.id === spot.id ? selectedIcon : defaultIcon}
                            eventHandlers={{
                                click: () => {
                                    setCurrentSpot(spot);
                                    getPhotos(spot.id);
                                    getComments(spot.id);
                                }
                            }}
                        />
                    ))}
                    <Search provider={new OpenStreetMapProvider()}/>
                </MapContainer>
            </div>
        </>
    );
};