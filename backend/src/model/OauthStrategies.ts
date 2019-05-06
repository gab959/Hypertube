import * as passport from 'passport';
import {UserInfos} from "./types";

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


/*
** 42 Oauth Strategy
*/

const FortyTwoStrategy = require('passport-42').Strategy;
passport.use(new FortyTwoStrategy({
        clientID: process.env.FORTYTWO_UID,
        clientSecret: process.env.FORTYTWO_SECRET,
        callbackURL: process.env.API_ADDRESS + "/auth/42/callback",
    },

    function(accessToken, refreshToken, profile, cb) {
        let user : UserInfos = {
            username : profile.username,
            firstname : profile.name.givenName,
            lastname : profile.name.familyName,
            email : profile.emails[0].value,
        };

        return cb(null, user);
    },
));

/*
** Github Oauth Strategy
*/

const GithubStrategy = require('passport-github').Strategy;
passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_UID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: process.env.API_ADDRESS + "/auth/github/callback",
    },

    function(accessToken, refreshToken, profile, cb) {

        let user : UserInfos;

        if (!profile.displayName) {
             user = {
                username: profile.username,
                firstname: 'Unknown',
                lastname: 'Unknown'
            };
        }
        else {
            user = {
                username: profile.username,
                firstname: profile.displayName.split(' ')[0],
                lastname: profile.displayName.split(' ')[1]
            };
        }

        return cb(null, user);
    },
));

/*
** Google Oauth Strategy
*/

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_UID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.API_ADDRESS + "/auth/google/callback",
    },

    function(accessToken, refreshToken, profile, cb) {
        let user : UserInfos = {
            username : profile.displayName,
            firstname : profile.name.givenName,
            lastname : profile.name.familyName,
            email : profile.emails[0].value
        };

        return cb(null, user);
    },
));

/*
** Instagram Strategy
*/

const InstagramStrategy = require('passport-instagram').Strategy;
passport.use(new InstagramStrategy({
        clientID: process.env.INSTA_UID,
        clientSecret: process.env.INSTA_SECRET,
        callbackURL: process.env.API_ADDRESS + "/auth/instagram/callback"
    },

    function(accessToken, refreshToken, profile, done) {
        let user : UserInfos = {
            username : profile.username,
            firstname : 'Unknown',
            lastname : 'Unknown'
        };

        return done(null, user);
    }
));

/*
** Spotify Strategy
*/

const SpotifyStrategy = require('passport-spotify').Strategy;
passport.use(new SpotifyStrategy({
        clientID: process.env.SPOTIFY_UID,
        clientSecret: process.env.SPOTIFY_SECRET,
        callbackURL: process.env.API_ADDRESS + "/auth/spotify/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        let user : UserInfos = {
            username : profile.username,
            firstname : 'Unknown',
            lastname : 'Unknown',
            email : profile.emails[0].value
        };

        return done(null, user);
    }
));
