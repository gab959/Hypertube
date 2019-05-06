import { Router, Request, Response, NextFunction } from 'express'
import * as bodyParser from 'body-parser'
import { User } from "../schema/db"
import { hashPassword, verifBody } from '../model/tools'
import { defaultCoreCipherList } from 'constants';
import * as mailer from 'nodemailer'
import * as uniqid from 'uniqid'
import {verifyJWT} from '../model/jwt'

const router = Router();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post("/users", urlencodedParser, jsonParser, async (req: Request, res: Response) => {
    let password;
    let checkpassword;
    if (typeof req.body.password !== "undefined") {
        checkpassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(req.body.password) && req.body.password.length >= 6;
        if (checkpassword === true)
            password = await hashPassword(req.body.password);
        else
            password = null;
    };

    let user = new User({
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: password,
        picture: "hypertube-image1.png",
        language: "english",
        oauth: false
    });

    try {
        await user.save();
        res.status(201).json({ status: "success" });
    } catch (e) {
        res.json({ status: "failure", data: e });
    }
});

router.get("/users/my-account/:token", async (req: Request, res: Response) => {
    if (typeof req.params.token && req.params.token !== "") {
        verifyJWT(req.params.token).then(async (result) => {
            await User.find({
                _id: result.payload._id
            })
            .then (doc => {
                if (doc.length === 1) {
                    res.json({ status: "success", data: doc[0]});
                } else {
                    res.json({ status: "failure" });
                }
            })
            .catch(err => {
                res.json({ status: "failure", data: err });
            });
        })
        .catch (err => {
            res.json({ status: "failure", data: err});
        })
    } else {
        res.json({status: "failure", message: "Not connected"});
    }
});

router.get("/users/:username", async (req: Request, res: Response) => {
    await User.find({
        username: req.params.username
    })
    .then (doc => {
        if (doc.length === 1) {
            res.json({ status: "success", data: doc[0]});
        } else {
            res.json({ status: "failure" });
        }
    })
    .catch(err => {
        res.json({ status: "failure", data: err });
    });
});

router.put("/users/my-account/general", urlencodedParser, jsonParser, async (req: Request, res: Response) => {
    if (typeof req.body.token && req.body.token !== "") {
        verifyJWT(req.body.token)
        .then(async (result) => {
            await User.updateOne(
                {_id: result.payload._id},
                { $set: {
                    username: req.body.username,
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                }},
                { runValidators: true, context: 'query' }
            )
            .then (doc => {
                res.json({ status: "success"});
            })
            .catch (err => {
                res.json({ status: "failure", data: err });
            });
        })
        .catch (err => {
            res.json({ status: "failure", data: err });
        })
    } else {
        res.json({status: "failure", message: "Not connected"});
    }


});

router.put("/users/my-account/password", urlencodedParser, jsonParser, async (req: Request, res: Response) => {
    if (typeof req.body.token && req.body.token !== "") {
        verifyJWT(req.body.token)
        .then(async (result) => {
            User.findById(result.payload._id, async function (err, user) {
                if (typeof user === "undefined") {
                    res.json({ status: "failure" });
                } else {
                    let password;
                    let checkpassword;
                    let currentPassword = await hashPassword(req.body.currentPassword);

                    if (typeof req.body.newPassword !== "undefined") {
                        checkpassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(req.body.newPassword) && req.body.newPassword.length >= 6;
                        if (checkpassword === true)
                            password = await hashPassword(req.body.newPassword);
                        else
                            password = null;
                    }
                    if (currentPassword !== user.password) {
                        res.json({ status: "failure", data: {errors : {currentPassword: {message: "Current password is not valid."}}}});
                    } else {
                        user.password = password;
                        try {
                            await user.save();
                            res.json({status: "success"});
                        } catch(err) {
                            res.json({ status: "failure", data: err });
                        }
                    }
                }
            });
        })
        .catch(err => {
            res.json({ status: "failure", data: err });
        });
    } else {
        res.json({status: "failure", message: "Not connected"});
    }

});

router.put("/users/my-account/settings", urlencodedParser, jsonParser, async (req: Request, res: Response) => {
    if (typeof req.body.token && req.body.token !== "") {
        verifyJWT(req.body.token)
        .then(async (result) => {
            let language;
            if (req.body.language === "french" || req.body.language === "French") {
                language = "french";
            } else if (req.body.language === "english" || req.body.language === "English") {
                language = "english";
            }
            else {
                res.json({ status: "failure", data: { language : { message: "Language is not correct"}} });
            }
            await User.updateOne(
                {_id: result.payload._id},
                {$set: {language: language}},
                {runValidators: true, context: 'query'}
            )
            .then (doc => {
                res.json({ status: "success", data: doc });
            })
            .catch (err => {
                res.json({ status: "failure", data: err });
            })
        })
        .catch(err => {
            res.json({ status: "failure", data: err });
        });
    } else {
        res.json({status: "failure", message: "Not connected"});
    }

});

router.put("/users/my-account/picture", urlencodedParser, jsonParser, async (req: Request, res: Response) => {
    if (typeof req.body.token && req.body.token !== "") {
        verifyJWT(req.body.token)
        .then(async (result) => {
            await User.updateOne(
                {_id: result.payload._id},
                {$set: {picture: req.body.picture}},
                { runValidators: true, context: 'query' }
            )
            .then (doc => {
                res.json({ status: "success", data: doc });
            })
            .catch (err => {
                res.json({ status: "failure", data: err });
            });
        })
        .catch(err => {
            res.json({ status: "failure", data: err });
        })
    } else {
        res.json({status: "failure", message: "Not connected"});
    }
});

router.get("/users/mail/:mail", urlencodedParser, jsonParser,  async (req: Request, res: Response) => {
    await User.find({
        email: req.params.mail
    })
    .then (async doc => {
        if (doc.length === 1) {
            let key = uniqid();
            await User.updateOne(
                {_id: doc[0]._id},
                { $set: {key: key}},
                { runValidators: true, context: 'query' }
            )
            .then (update => {
                let transporter = mailer.createTransport({
                    host: "mail-student.le-101.fr",
                    port: 25,
                    secure: false
                });
                let message = {
                    from: "hypertube@le-101.fr",
                    to: req.params.mail,
                    subject: "Reset your password.",
                    html: "<p>Hi,<br><br>If you want to reset your password, please follow this <a href='http://127.0.0.1:8080/profile/password/"+ key + "'>link</a><br><br>Sincerely,<br><br>Hypertube's team</p>"
                };
                transporter.sendMail(message);
                res.json({ status: "success", data: doc});
            })
            .catch (err => {
                res.json({status: "failure", data: {mail: {message: "Mail not send"}}});
            })
        } else {
            res.json({status: "failure" });
        }
    })
    .catch (err => {
        res.json({status: "failure", data: err});
    })
});

router.put("/users/password", urlencodedParser, jsonParser, async (req: Request, res: Response) => {
    if (typeof req.body.password === "undefined" || typeof req.body.key === "undefined" || req.body.key.length === 0) {
        return res.json({status: "failure", message: "Password or key is empty."});
    }
    let password;
    let checkpassword;
    if (typeof req.body.password !== "undefined") {
        checkpassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(req.body.password) && req.body.password.length >= 6;
        if (checkpassword === true)
            password = await hashPassword(req.body.password);
        else
            password = null;
    }

    await User.findOneAndUpdate(
        {key: req.body.key},
        {$set : {
            password: password,
            key: null
        }},
        { runValidators: true, context: 'query' }
    )
    .then(doc => {
        res.json({status: "success", data: doc});
    })
    .catch(err => {
        res.json({status: "failure", data: err});
    })
});

router.get('/user/username', (req: Request, res: Response) => {
    let token = req.headers.cookie.slice(6)
    verifyJWT(token).then((result) => {
        res.json({status: 'success', data: result.payload})
    })
    .catch((err) => {
        res.json({status: 'failure', message: err})
    })
});

router.post('/users/movie', urlencodedParser, jsonParser, (req: Request, res: Response) => {
    if (typeof req.body.token && req.body.token !== "") {
        verifyJWT(req.body.token)
        .then(async (result) => {
            let movie = {
                id: req.body.movie_id
            };
            await User.updateOne(
                {_id: result.payload._id},
                {$push: {movie: movie}},
                { runValidators: true, context: 'query' }
            )
            .then(() => {
                res.json({status: "success"});
            })
            .catch((err) => {
                res.json({status: "failure", message: "Not updated" ,data: err});
            })
        })
        .catch(err => {
            res.json({status: "failure", message: "Not connected" ,data: err});
        });
    } else {
        res.json({status: "failure", message: "Not token"});
    }
});

router.get('/users/movie/:token', (req: Request, res: Response) => {
    if (typeof req.params.token && req.params.token !== "") {
        verifyJWT(req.params.token)
        .then (async (result) => {
            await User.find({_id: result.payload._id})
            .then (doc => {
                let movies = [];
                for (let i = 0; i < doc[0].movie.length; i++) {
                    if (!movies.includes(doc[0].movie[i].id)) {
                        movies.push(doc[0].movie[i].id);
                    }
                }
                if (movies.length === 0) {
                    res.json({status: "failure", message: "No movie watched"})
                } else {
                    res.json({status: "success", movies: movies});
                }
            })
            .catch (err => {
                res.json({status: "failure", message: "Not informations" ,data: err});
            })
        })
        .catch(err => {
            res.json({status: "failure", message: "Not connected" ,data: err});
        })
    } else {
        res.json({status: "failure", message: "Not token"});
    }
});

export const user: Router = router;
