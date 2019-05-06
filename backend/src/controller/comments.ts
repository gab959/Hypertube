import { Router, Request, Response, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import { Comment } from "../schema/db"
import { defaultCoreCipherList } from 'constants';
import {verifyJWT} from '../model/jwt'

const router = Router();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get("/comments/:id_movie", async (req: Request, res: Response) => {
    await Comment.find({movie_id: req.params.id_movie})
    .then(doc => {
        if (doc.length > 0) {
            return res.json({status: "success", data: doc});
        } else {
            return res.json({status: "failure", message: "No comments."});
        }
    })
    .catch(err => {
        return res.json({status: "failure", data: err});
    })
});

router.post("/comments/", jsonParser, urlencodedParser, async (req: Request, res: Response) => {
    if (typeof req.body.token && req.body.token !== "") {
        verifyJWT(req.body.token)
        .then(async (result) => {
            let newComment = new Comment({
                movie_id: req.body.id_movie,
                comment: req.body.comment,
                user_id: result.payload._id
            });
            try {
                await newComment.save();
                res.status(201).json({ status: "success" });
            } catch (e) {
                res.json({ status: "failure", message: "Not save", data: e });
            }
        })
        .catch(err => {
            res.json({status: "failure", message: "Error create new comment", data: err});
        });
    } else {
        res.json({status: "failure", message: "Not connected"});
    }
});

export const comment: Router = router;
