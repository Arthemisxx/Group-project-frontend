export interface Spot {
    id: number;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    categoryId: Category;
    author: Author;
    address?: Address;

}

interface Category {
    id: number;
    name: string;
}

export interface Author {
    id: number;
    displayName: string;
    avatarUrl: string;
    bio: string;

}

export interface Address {
    name: string;
    country: string;
    region: string;

}

