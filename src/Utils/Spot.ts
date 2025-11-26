export interface Spot {
    id: number;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    categoryId: Category;
    author: User;
    address?: Address;

}

interface Category {
    id: number;
    name: string;
}

export interface User {
    name: string;

}

export interface Address {
    name: string;
    country: string;
    region: string;

}

