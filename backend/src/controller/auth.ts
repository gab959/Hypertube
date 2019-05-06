import * as passport from 'passport';
require('../model/OauthStrategies.ts');
import { Router, Request, Response } from 'express';
import {User} from "../schema/db";
import { hashPassword} from '../model/tools';
import {createJWT, sendJWT} from '../model/jwt';
require('../schema/db');
import { UserInfos} from "../model/types";


const router = Router();

router.use(passport.initialize());


/*
** Local authentication strategy
*/

router.post("/", async (req: Request, res: Response) => {

    let e : string = 'Invalid username or password';

    if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string')
        return res.json({status: 'failure', message : e});

    let username : string = req.body.username;
    let password : string = req.body.password;

    var hash : string = await hashPassword(password);

    let db_pass : string = '';
    let payload : UserInfos = {};

    await User
        .find({'username':username})
        .then(doc => {
            if (typeof doc[0] !== "undefined") {
                db_pass = doc[0].password;
                payload._id = doc[0]._id;
                payload.username = doc[0].username;
            }
        })
        .catch(() => {
            return res.json({status: 'failure', message : e});
        });

    if (hash === db_pass) {
        let token : string = await createJWT(payload);
        return res.json({
            status: 'success',
            message: 'Authentication successful!',
            cookie : token
        });
    }
    else {
        return res.json({status: 'failure', message: e});
    }
    });


/*
** 42 Oauth routes
*/

router.get('/42',
    passport.authenticate('42')
);

router.get('/42/callback',
    passport.authenticate('42', {failureRedirect : process.env.CLIENT_ADDRESS + '/login'}),
    sendJWT
);


/*
** Github Oauth routes
*/

router.get('/github',
    passport.authenticate('github', { scope : ['user'] })
);

router.get('/github/callback',
    passport.authenticate('github', {failureRedirect: process.env.CLIENT_ADDRESS + '/login'}),
    sendJWT
);


/*
** Google Oauth routes
*/

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: process.env.CLIENT_ADDRESS + '/login'}),
    sendJWT
);


/*
** Instagram Oauth routes
*/

router.get('/instagram',
    passport.authenticate('instagram')
);

router.get('/instagram/callback',
    passport.authenticate('instagram', {failureRedirect: process.env.CLIENT_ADDRESS + '/login'}),
    sendJWT
);


/*
** Spotify Oauth routes
*/

router.get('/spotify',
    passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] })
);

router.get('/spotify/callback',
    passport.authenticate('spotify', {failureRedirect: process.env.CLIENT_ADDRESS + '/login'}),
    sendJWT
);

export const auth: Router = router;
