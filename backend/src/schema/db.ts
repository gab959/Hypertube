import * as mongoose from 'mongoose'
import * as uniqueValidator from 'mongoose-unique-validator'
import {userModel} from "./userSchema";
import { commentModel } from './commentSchema';
import { movieModel } from './movieSchema';

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).catch(e => {
    console.error(e)
});
mongoose.set('useCreateIndex', true);

export const User = userModel(mongoose, uniqueValidator);
export const Comment = commentModel(mongoose);
export const Movie = movieModel(mongoose, uniqueValidator);
