import type Spot from "./Spot.ts";

export const fetchSpotsData = async():Promise<Spot[]> => {
    //TODO - podpiąć backend
    const response = await fetch("http://...")
    return response.json();
}