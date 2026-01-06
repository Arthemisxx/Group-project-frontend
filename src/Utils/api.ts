import axiosClient from "./../Auth/axiosClient.ts"

import type {Spot, SpotCreate, SpotUpdate} from "./Spot.ts";
import type {Photo} from "./Photo.ts";
import type {Comment} from "./Comment.ts";
import type {PostComment} from "./postComment.ts";


export interface UploadPhotoData {
    file: File;
    caption: string;
}

export const uploadSpotPhoto = async (spotId: number, photoData: UploadPhotoData) => {
    const formData = new FormData();

    formData.append("image", photoData.file);

    const jsonBody = JSON.stringify({
        spot_id: spotId,
        caption: photoData.caption || ""
    });

    const jsonBlob = new Blob([jsonBody], { type: 'application/json' });
    formData.append("data", jsonBlob);

    return await axiosClient.post('/photos/upload', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// export const fetchSpotsData = async (minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<Spot[]> => {
//     const response = await axiosClient.get<Spot[]>('/spots/map/search', {
//         params: {
//             minLat,
//             maxLat,
//             minLng,
//             maxLng
//         }
//     });
//     return response.data;
// }

//@ts-ignore
export const fetchSpotsData = async (minLat: number, maxLat: number, minLng: number, maxLng: number): Promise<Spot[]> => {
    const response = await axiosClient.get<Spot[]>('/spots');
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

export const updateSpot = async (spot: SpotUpdate, id:number): Promise<Spot> => {
    const response = await axiosClient.put<Spot>(`/spots/${id}`, spot);
    return response.data;
}

export const deletePhoto = async (id: number): Promise<void> => {
    await axiosClient.delete(`photos/${id}`);
}

export const saveSpotForLater = async (id: number) : Promise<void> => {
    await axiosClient.post(`for-later/${id}`);
}

export const removeSpotForLater = async (id: number) : Promise<void> => {
    await axiosClient.delete(`for-later/${id}`);
}

export const isSpotSavedForLater = async (id: number) : Promise<boolean> => {
    const response = await axiosClient.get(`for-later/${id}`);
    return response.data;
}

export const getSpotsSavedForLater = async () : Promise<Spot[]> => {
    const response = await axiosClient.get(`for-later`);
    return response.data;
}

export const getSpotLikesCount = async (id: number) : Promise<number> => {
    const response = await axiosClient.get(`likes/spots/${id}`);
    return response.data;
}

export const likeSpot = async (id: number) : Promise<void> => {
    await axiosClient.post(`likes/spots/${id}`);
}

export const dislikeSpot = async (id: number) : Promise<void> => {
    await axiosClient.delete(`likes/spots/${id}`);
}

export const isSpotLiked = async (id: number) : Promise<boolean> => {
    const response = await axiosClient.get(`likes/spots/${id}/is-liked`);
    return response.data;
}



