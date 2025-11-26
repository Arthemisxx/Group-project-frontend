import type {Spot} from "./Spot.ts";
import type {Photo} from "./Photo.ts";

export const fetchSpotsData = async (minLat: number, maxLat: number, minLng: number, maxLng: number):Promise<Spot[]> => {
    const response = await fetch(`http://localhost:8080/spots/map/search?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`);
    return response.json();
}

export const fetchSpotPhotos = async (id: number):Promise<Photo[]> => {
    const response = await fetch(`http://localhost:8080/photos/spot/${id}`);
    return response.json();
}