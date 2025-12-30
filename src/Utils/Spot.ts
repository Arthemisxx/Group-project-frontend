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

export interface SpotCreate{
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    categoryId: Category;
    author: Author;
    addressName: string;
    addressCountry: string;
    addressRegion: string;

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

