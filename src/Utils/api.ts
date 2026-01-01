import axiosClient from "./../Auth/axiosClient.ts"

import type {Spot, SpotCreate} from "./Spot.ts";
import type {Photo} from "./Photo.ts";
import type {Comment} from "./Comment.ts";
import type {PostComment} from "./postComment.ts";


export const fetchSpotsData = async (minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<Spot[]> => {
    const response = await axiosClient.get<Spot[]>('/spots/map/search', {
        params: {
            minLat,
            maxLat,
            minLng,
            maxLng
        }
    });
    return response.data;
}


export const fetchSpotPhotos = async (id: number): Promise<Photo[]> => {
    const response = await axiosClient.get<Photo[]>(`/photos/spot/${id}`);
    return response.data;
};

export const fetchComments = async (id: number): Promise<Comment[]> => {
    const response = await axiosClient.get<Comment[]>(`/comments/spot/${id}`);
    return response.data;
};

export const insertComment = async (comment: PostComment): Promise<Comment> => {
    const response = await axiosClient.post<Comment>('/comments', comment);
    return response.data;
};

export const insertSpot = async (spot: SpotCreate): Promise<Spot> => {
    const response = await axiosClient.post<Spot>('/spots', spot);
    return response.data;
};


