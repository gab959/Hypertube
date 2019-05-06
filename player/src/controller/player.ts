import { Router, Request, Response } from 'express';
import {decodeMagnet } from '../model/player'
import * as pump from "pump"
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
import { ffprobe } from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
import * as fs from 'fs'
const router = Router()

router.post('/parseMagnet', (req: Request, res: Response) => {
    decodeMagnet(req.body.magnet).then((decoded) => {
        res.json({status: 'success', data: decoded})
    })
    .catch((e) => {
        res.json({status: 'failure', message: e})
    })
})

router.get('/stream/:folder/:file', async (req: Request, res:Response) => {

    let path: string = 'public/hyperteam/' + req.params.folder + '/' + req.params.file + '.mp4'

    if (!fs.existsSync(path))
        return (res.sendStatus(404));

    try {
        let conversion = ffmpeg(path)
            .withVideoCodec("libvpx")
            .withVideoBitrate("4000")
            .withAudioCodec("libvorbis")
            .withAudioBitrate("256k")
            .audioChannels(2)
            .outputOptions([
                "-preset ultrafast",
                "-deadline realtime",
                "-error-resilient 1",
                "-movflags +faststart",
            ])
            .format("matroska")
            .seekInput(Math.round(req.query.time * 100) / 100)
        res.contentType('video/webm')
        res.on("close", () => {
            conversion.kill("SIGTERM")
        })
        pump(conversion, res);
    } catch (e) {
        return res.json({status: 'failure', data: e})
    }
})

export const player: Router = router
