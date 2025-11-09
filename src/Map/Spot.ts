export default interface Spot{
    id: number;
    title: string;
    description?: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    category: Category;
    author: User;
    address?: Address;

}

interface Category{
    id: number;
    name: string;
}

interface User {
    name: string;

}

interface Address {
    name: string;
    country: string;
    region: string;

}