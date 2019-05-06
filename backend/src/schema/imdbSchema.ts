import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const imdbSchema = new Schema({
    tconst: String,
    averageRating: Number,
    numVotes: Number
}, { collection : 'imdb' })

export const Rating = mongoose.model('Rating', imdbSchema)