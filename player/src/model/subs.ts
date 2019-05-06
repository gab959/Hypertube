const axios = require ('axios');
const fs = require('fs');
import * as OS from 'opensubtitles-api';


/* Authenticating to OS */

async function OSauth (OpenSubtitles : OS) {

    OpenSubtitles.login()
        .catch(err => {
            console.log(err);
            return err;
        });
}

/* Download sub and stores it in given path */

async function GetWriteSub (subLink : String, language : String, path : String) {

    await axios.get(subLink)
        .then(async function (response) {
            const sub = await response.data;
            await fs.writeFileSync(path, sub);
        })
        .catch(function (error) {
            console.log('Subtitle request to OS failed');
            return;
        });
}


/*
** SubDL downloads subs from IMDB id and returns nothing if everything is ok, an error string else
*/

export async function subDL (imdbid : Number) {

    /* Checking if subs exist and exiting the function if so */
    const subDir = 'public/hyperteam/subtitles/';

    const subpath = {
        en: subDir + imdbid + '_' + 'en' + '.vtt',
        fr: subDir + imdbid + '_' + 'fr' + '.vtt'
    };

    if (fs.existsSync(subpath.en) && fs.existsSync(subpath.fr))
        return;

    if (!fs.existsSync(subDir))
        await fs.mkdirSync(subDir);

    const OpenSubtitles = new OS({
        useragent: 'Popcorn Time NodeJS',
        username: 'Hyper101',
        password: 'Qwerty1@',
        ssl: true
    });

    await OSauth(OpenSubtitles);

    /* Retrieves fr and en subs from API and stores them into the public dir */
    return await OpenSubtitles.search({
        sublanguageid: 'en',
        extensions: ['srt', 'vtt'],
        limit: '1',
        imdbid: imdbid,
        gzip: true
    })
        .then (async subtitles => {
            if (typeof (subtitles.en) === "undefined" || subtitles.en === '' ||
                typeof (subtitles.fr) === "undefined" || subtitles.fr === '') {
                console.log('no subtitles found');
                return 'No subs found for this movie';
            }

            await GetWriteSub(subtitles.fr[0].vtt, 'fr', subpath.fr);
            await GetWriteSub(subtitles.en[0].vtt, 'en', subpath.en);

        })
        .catch (error => {
            console.log(error);
            return error;
        });
}
