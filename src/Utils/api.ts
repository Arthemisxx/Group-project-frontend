import type Spot from "./Spot.ts";

export const fetchSpotsData = async (minLat: number, maxLat: number, minLng: number, maxLng: number):Promise<Spot[]> => {
    const response = await fetch(`http://localhost:8080/spots/map/search?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`);
    return response.json();
}