import { Router, Request, Response } from 'express'
import axios from 'axios'
import { ytsBuilder, validRequest, addImdbRating } from '../model/movie';
const router = Router()
router.get('/movies/:page', async (req: Request, res: Response) => {
    validRequest(req.query).then(async () => {
        let ytsParams: string = ytsBuilder(req.query)
        let yts = (await axios.get('https://yts.am/api/v2/list_movies.json?page=' + req.params.page + ytsParams)).data
        addImdbRating(yts.data.movies).then((movies) => {
            res.json({status: 'success', data: movies})
        })
        .catch((err) => {
            res.json({status: 'failure', data: err})
        })
    })
    .catch((error) => {
        res.json({status: 'failure', message: error})
    })
})
export const movie: Router = router