import type {Author} from "./Spot.ts";

export interface Comment{
    id: number;
    content: string;
    createdAt: string;
    author: Author;
    photoId: number;
    spotId: number;
}