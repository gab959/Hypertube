import * as express from 'express';
import {Request, Response, NextFunction} from "express";
import * as cors from 'cors';
import { routes } from './routes';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

const app = express();

app.use(bodyParser.json());
app.use('/', (err, req : Request, res : Response, next : NextFunction) => {
    if (err)
        res.json({status : 'failure', message : 'Invalid request'});
    else
        next();
});
app.use(morgan(":method :url :status - :response-time ms"))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: [process.env.CLIENT_ADDRESS, process.env.API_ADDRESS],
    credentials : true
}));

app.use(routes);

app.listen(process.env.API_PORT, () => {
    console.log("\x1b[36m", "• Server running on port", process.env.API_PORT,"...", "\x1b[0m");
});
