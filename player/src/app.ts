import * as express from 'express'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser';
import * as cors from 'cors'
import { player } from './controller/player';
import { subs } from './controller/subs';
import { Server } from 'http'
import {socket} from './model/player'

const app = express();
const port: number = 14000;

app.use(bodyParser.json());

app.use(morgan('tiny'));

let http: Server = require('http').Server(app)

app.use(cors({
    origin: '*',
    credentials : true
}));

app.use(express.static('public'));

app.use('/', player);

app.use('/', subs);

socket(http);
http.listen(port, () => {
    console.log(port)
});
