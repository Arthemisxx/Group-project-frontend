import type {Spot, Author} from "./Spot.ts";

export interface Photo {
    id: number;
    url: string;
    thumbnail_url?: string;
    caption?: string;
    createdAt: string;
    author: Author;
    spot: Spot;
}