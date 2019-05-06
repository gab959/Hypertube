import { Router, Request, Response, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import { Movie } from "../schema/db"
import * as fs from 'fs'

const router = Router();
const rimraf = require('rimraf')

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get("/torrents/:movie_id", async (req: Request, res: Response) => {
    await Movie.find({movie_id: req.params.movie_id })
    .then(async doc => {
        if (doc.length > 0) {
            await updateTimestamp(doc[0]);
            removeOldMovie(doc[0]);
            res.json({ status: "success", data: doc[0] });
        } else {
            res.json({ status: "failure", message: "No torrents downloaded" });
        }
    })
    .catch(err => {
        res.json({ status: "failure", data: err });
    })
});

router.post("/torrents", jsonParser, urlencodedParser, async (req: Request, res: Response) => {
    let timestamp = Math.round(Date.now() / 1000);
    let torrents = new Movie({
        movie_id: req.body.movie_id,
        name: req.body.torrentName,
        size: req.body.torrentSize,
        timestamp: timestamp,
        isComplete: false
    });

    try {
        await torrents.save();
        res.status(201).json({ status: "success" });
    } catch (err) {
        res.json({ status: "failure", error: err });
    }
});

router.put("/torrents/:movie_id", jsonParser, urlencodedParser, async (req: Request, res: Response) => {
    await Movie.updateOne(
        {movie_id: req.params.movie_id},
        {$set: {
            isComplete: req.body.isComplete
        }},
        {runValidators: true, context: 'query'}
    )
        .then(doc => {
            res.json({status: "success"});
        })
        .catch(err => {
            res.json({status: "failure", data: err});
        })
});

async function updateTimestamp(movie) {
    let timestamp = Math.round(Date.now() / 1000);
    await Movie.updateOne(
        {_id: movie._id},
        {$set: {
            timestamp: timestamp
        }},
        { runValidators: true, context: 'query' }
    )
    .then (doc => {
        return true;
    })
    .catch( err => {
        return false;
    })
}

async function removeOldMovie(movie) {
    await Movie.find({
        timestamp: {$lt: (Date.now()/1000) - 2592000}
    })
    .then (async doc => {
        if (doc.length > 0) {
            for (let i in doc) {
                if (doc[i].movie_id != movie.movie_id) {
                    await Movie.deleteOne({_id: doc[i]._id })
                    .then(document => {
                        removeFiles(doc[i].name);
                    })
                    .catch(err => {console.log(err)})
                }
            }
        }
    })
    .catch(err => {console.log(err)})
}

function removeFiles(name) {
    let path = name.split("/");
    let removePath = "hyperteam/" +  path[4];
    rimraf(removePath, err=> {})
}

export const torrent: Router = router;
