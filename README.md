# Hypertube

This project is a video streaming web-app, similar to PopcornTime 🍿\
I worked with @AntoineDrt and Dylan Fevrier to develop this application.

## Stack

- Backend : Node.js, TypeScript, Express.js, TorrentStream, FFMPEG, MongoDB
- Frontend : Vue.js, Vuetify, Video.js

## Functionalities

#### User

- Register using email address, username, full name and a secured password
- Omniauth strategies : 42, Google, Instagram, Spotify and Github
- The user can change all his infos as well as the subs language and his avatar

#### Library

- The research allows to select multiple filters and to sort the movies
- Each thumbnail contains all the necessary informations on the movie : casting, IMDB note, synopsis

#### Video

Once the user clicks on the "Play" button, the server starts downloading the torrent, encodes the movie to the right video format on the fly and streams it to the client's video player.

We used TorrentStream to download the movies and FFMPEG to convert them.
