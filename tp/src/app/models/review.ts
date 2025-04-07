export interface Review {
    id?: number;
    user: {
        id?: number;
        firstName: string;
        lastName: string;
        age: number;
        email: string;
        points: number;
    };
    movie: {
        id?: number;
        title: string;
        releaseDate: Date;
        director: string;
        rate?: number;
        synopsis: string;
        image?: string;
    };
    rate: number;
    text: string;
    reviewDate: Date;
}