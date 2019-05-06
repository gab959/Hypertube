import {Request, Response, Router} from 'express';
import { subDL } from '../model/subs';
import * as fs from "fs";

const router = Router();

/*
** Downloads subs relative to imdb_id
*/

router.get('/subdl/:imdb_id', async (req: Request, res: Response) => {

    const imdb_id = req.params.imdb_id;
    let regex = /^[0-9]+$/;
    if (!regex.test(req.params.imdb_id)){
        res.send({status: "failure", message: "ID format is not correct"});
    }

    const subPath = 'public/hyperteam/subtitles/' + imdb_id;
    const subFR = subPath + '_fr.vtt';
    const subEN = subPath + '_en.vtt';
    const subs = {en : false, fr : false};

    await subDL(imdb_id)
        .then (async () => {
            try {
                if (await fs.existsSync(subFR))
                    subs.fr = true;
                if (await fs.existsSync(subEN))
                    subs.en = true;
            } catch (err) {
                console.error('subdl route sub doenst exists ', err)
            }
            res.send({status : "success", sub : subs})
        })
        .catch (err => {
            res.sendStatus(404);
        })
});


/*
** Streams requested subs
*/

router.get('/sub/:imdb_id/:lg', (req:Request, res : Response) => {

    if (!(/^\d+$/.test(req.params.imdb_id)) || (req.params.lg !== 'fr' && req.params.lg !== 'en'))
        return res.sendStatus(400);

    const subPath = 'public/hyperteam/subtitles/' + req.params.imdb_id + '_' + req.params.lg + '.vtt';

    if (subPath === undefined){
        return res.sendStatus(404);
    }
    else if (fs.existsSync(subPath)) {
        res.setHeader("Content-Type", "text/vtt");
        fs.createReadStream(subPath)
            .pipe(res);
    }
    else
        return res.sendStatus(404);
});


export const subs: Router = router;
