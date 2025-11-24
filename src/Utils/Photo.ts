import type {User} from "./Spot.ts";

export interface Spot {
    id: number;
    url: string;
    thumbnail_url?: string;
    caption?: string;
    createdAt: string;
    author: User;
    spot: Spot;
}