import { Movies, Search, Genre } from "./types";
import { Rating } from '../schema/imdbSchema'
import * as mongoose from 'mongoose'
mongoose.connect(process.env.DB_URL)
let db = mongoose.connection

export function ytsBuilder(query: Search): string {
    let params: string = ''
    switch (true) {
        case query.sort === 'Popularity' :
            params += '&sort_by=download_count'
            break
        case query.sort === 'Title' :
            params += '&sort_by=title'
            break
        case query.sort === 'Year' :
            params += '&sort_by=year'
            break
        case query.sort === 'Likes' :
            params += '&sort_by=like_count'
            break
        case query.sort === 'Most recent' :
            params += '&sort_by=date_added'
            break
    }
    if (query.order === '1')
        params += '&order_by=asc'
    if (query.keywords.length > 0)
        params += '&query_term=' + query.keywords
    if (query.genre.length > 0 && query.genre !== 'undefined')
        params += '&genre=' + query.genre
    return (params + '&minimum_rating=' + query.minRating)
}

export function validRequest(query: Search): Promise<boolean|string> {
    return new Promise ((resolve, reject) => {
        let model: Array<string> = ['sort', 'order', 'genre', 'keywords', 'minRating']
        for (let i in model) {
            if (!query.hasOwnProperty(model[i])) {
                reject(model[i] + ' is missing.')
                break
            }
        }
        if ( typeof query.sort !== 'string' ||
            typeof query.order !== 'string' ||
            typeof query.genre !== 'string' ||
            typeof query.keywords !== 'string' ||
            typeof query.minRating !== 'string')
            reject('Invalid parameters type.')
        if (!sortList.includes(query.sort) || !genreList.includes(query.genre))
            reject('Invalid genre or sort.')
        resolve(true)
    })
}

export function addImdbRating(yts: Array<Movies>): Promise< Array< Movies > > {
    return new Promise (async (resolve, reject) => {
        let idArray: Array<string> = []
        for (let i in yts) {
            idArray.push(yts[i].imdb_code)
        }
        Rating.find({tconst: { $in: idArray }}, (err, docs) => {
            if (err === null) {
                for (let i in yts) {
                    yts[i].imdb_rating = docs[i] !== undefined ? docs[i].averageRating : undefined
                    yts[i].numVotes = docs[i] !== undefined ? docs[i].numVotes : undefined
                }
                resolve(yts)
            } else 
                reject(err)
        })
    })
}

const genreList: Array<string> = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Thriller',
    'TV Movie',
    'War',
    'Western',
    '',
    'undefined'
]

const sortList: Array<string> = [
    'Title',
    'Popularity',
    'Year',
    'Likes',
    'Most recent'
]