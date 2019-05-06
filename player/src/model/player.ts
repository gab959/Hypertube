import * as magnet from 'magnet-uri'
import * as torrentStream from 'torrent-stream'
import * as uuidv1 from 'uuid/v1'
import { Server } from 'http';
import axios from 'axios'

interface MovieData {
    totalSize: number,
    hash: string,
    movieId: number
}

const instance = axios.create({
    baseURL: 'http://127.0.0.1:13000'
});

async function postTorrent(body) {
    return (await instance.post("/torrents", body)).data
};

export function decodeMagnet(uri: string): Promise<any> {
    return new Promise ((resolve, reject) => {
        resolve(magnet.decode(uri))
    })
}

function buildURI(hash:string): string {
    return ( 'magnet:?xt=urn:btih:' + hash + '&dn=' + uuidv1() + '.mp4' )
}

async function saveMovie(movie: MovieData, stream): Promise<boolean> {
    let result = (await instance.post('/torrents', {
        movie_id: movie.movieId,
        torrentName: 'http://127.0.0.1:14000/stream/' + stream.path.slice(0, stream.path.length - 4) + '?size=' + stream.length,
        torrentSize: movie.totalSize
    })).data
    if (result.status === "failure") {
        if (typeof result.error.errors.movie_id.kind !== "undefined" && result.error.errors.movie_id.kind === "unique") {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

async function completedMovie(movie: MovieData) {
    let result = (await instance.put('/torrents/'+ movie.movieId, {
        isComplete: true
    })).data;
    if (result.status === "success") {
        return true;
    } else {
        return false;
    }
}

export function socket(http: Server) {
    let io = require('socket.io')(http)

    io.on('connection', function(socket) {
        console.log('connection', socket.id)
        socket.emit('id', socket.id)
        socket.on('stream', (movie: MovieData) => {
            console.log('Player running...')
            let uri = buildURI(movie.hash)
            const engine = torrentStream(uri, {
                path: 'public/hyperteam',
                tracker: [
                    'udp://open.demonii.com:1337/announce',
                    'udp://tracker.openbittorrent.com:80',
                    'udp://tracker.coppersurfer.tk:6969',
                    'udp://glotorrents.pw:6969/announce',
                    'udp://tracker.opentrackr.org:1337/announce',
                    'udp://torrent.gresille.org:80/announce',
                    'udp://p4p.arenabg.com:1337',
                    'udp://tracker.leechers-paradise.org:6969'
                ]
            })
            engine.on('ready', async () => {
                let stream = engine.files.filter(file => !file.name.includes(".jpg"))[0];
                await stream.createReadStream();
                socket.emit('stream', 'Total pieces: ' + engine.torrent.pieces.length);
                let progress: number;
                let saved: boolean = false;
                let isComplete: boolean = false;
                await engine.on('download', async (data) => {
                    progress =  Math.round(engine.swarm.downloaded/ (movie.totalSize / 20) * 10000) / 100;
                    console.log(progress);
                    if (progress >= 100 && !saved)
                        saved = await saveMovie(movie, stream);
                    if (progress  >= 1990 && !isComplete) {
                        isComplete = await completedMovie(movie);
                    }
                    socket.emit('stream', {
                        progress: progress,
                        speed: engine.swarm.downloadSpeed(),
                        path: 'http://127.0.0.1:14000/stream/' + stream.path.slice(0, stream.path.length - 4) + '?size=' + stream.length,
                    })
                });
                socket.emit('stream', 'Done')
                return
            })
        })
    })
}
