import * as jwt from 'jsonwebtoken'
import {AuthRequest, UserInfos} from "./types";
import {Response} from "express";
import {User} from "../schema/db";
import {hashPassword, randomMail} from "./tools";
import *  as uuidv1 from 'uuid/v1';

export async function createJWT (payload : UserInfos) {
    return jwt.sign({payload: payload}, process.env.JWT_SECRET, {expiresIn: "2 days"});
}

export function verifyJWT(token): Promise<any> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err || !decodedToken)
            return reject(err)
        resolve(decodedToken)
        })
    })
}

export async function sendJWT (req: AuthRequest, res: Response) {

    let payload : UserInfos = {};

    await User.find ({ $or: [ {'username': req.user.username}, {'email' : req.user.email} ] })
        .then(async doc => {

            if (typeof doc[0] === "undefined") {
                let user = new User ({
                    username : req.user.username,
                    firstname : req.user.firstname,
                    lastname : req.user.lastname,
                    password : await hashPassword(uuidv1()),
                    picture : "hypertube-image1.png",
                    language : "english",
                    oauth : true
                });

                if (req.user.email === undefined)
                    user.email = await randomMail();
                else
                    user.email = req.user.email;

                try {
                    await user.save();
                    payload._id = user._id;
                    payload.username = user.username
                } catch (e) {
                    return res.redirect(process.env.CLIENT_ADDRESS + '/login');
                }
            }

            else {
                payload._id = doc[0]._id;
                payload.username = doc[0].username
            }

            let token : string = await createJWT(payload);

            res.cookie("token", token);
            res.header({
                status: 'success',
                message: 'Authentication successful!',
            });
        })
        .catch(err => {
            console.log('Failed to fetch database : ',  err);
        });
    res.redirect(process.env.CLIENT_ADDRESS);
}
