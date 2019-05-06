import { Request } from "express"

export interface UserInfos {
    email? : string,
    username? : string,
    firstname? : string,
    lastname? : string,
    password? : string,
    picture? : string,
    language? : string,
    _id? : string
}

export interface AuthRequest extends Request {
    user: UserInfos
}
export interface Movies {
    title: string,
    rating: number,
    medium_cover_image: string,
    synopsis: string,
    year: string,
    genres: Array<string>,
    imdb_rating?: number,
    imdb_code?: string,
    numVotes?: number
}

export interface Search {
    sort: string,
    order: string,
    genre: string,
    keywords: string,
    minRating: number
}

export interface Genre {
    id: number,
    name: string
}
