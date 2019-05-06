import { user } from './controller/user'
import { comment } from './controller/comments'
import { auth } from './controller/auth'
import { movie } from './controller/movie'
import { torrent } from './controller/torrent'
import * as express from 'express'

const app = express();

app.use('/', user);
app.use('/auth', auth);
app.use('/', movie);
app.use('/', comment);
app.use('/', torrent);

export const routes = app;
