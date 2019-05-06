import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:13000'
});

const player = axios.create({
    baseURL: 'http://127.0.0.1:14000'
})

const test = {

    async movies(param) {
        param.minRating = param.minRating * 2 > 9 ? 4.5 : param.minRating
        return (await instance.get('/movies/' + param.page
                                    + '?sort=' + param.sort
                                    + '&order=' + param.order
                                    + '&genre=' + param.genre
                                    + '&keywords=' + param.keywords
                                    + '&minRating=' + param.minRating * 2)).data.data
    },

    async parseMagnet(data) {
        return (await player.post('/parseMagnet', data)).data
    },

    async stream(data) {
        return (await player.post('/stream', data)).data
    },

    async ping() {
        return (await player.post('/ping')).data
    }
};

const movie = {
    async details(id) {
        return (await instance.get("https://yts.am/api/v2/movie_details.json?movie_id=" + id + "&with_images=true&with_cast=true"));
    }
}

const user = {
    async register(data) {
        return (await instance.post('/users', data)).data
    },
    async profile(username) {
        return (await instance.get('/users/' + username)).data
    },
    async account(token) {
        return (await instance.get('/users/my-account/' + token)).data
    },
    async updatePicture(data) {
        return (await instance.put('/users/my-account/picture', data)).data
    },
    async updateGeneral(data) {
        return (await instance.put('/users/my-account/general', data)).data
    },
    async updatePassword(data) {
        return (await instance.put('/users/my-account/password', data)).data
    },
    async updateSetting(data) {
        return (await instance.put('/users/my-account/settings', data)).data
    },
    async passwordForget(email) {
        return (await instance.get('/users/mail/' + email)).data
    },
    async resetPassword(data) {
        return (await instance.put('/users/password', data)).data
    },
    async getUsername() {
        return (await instance.get('/user/username', {withCredentials: true})).data
    },
    async addMovie(body) {
        return (await instance.post("/users/movie", body)).data
    },
    async getMovie(token) {
        return (await instance.get("/users/movie/" + token)).data
    }
};

const auth = {
    async login(data) {
        return (await instance.post('/auth', data)).data;
    }
};

const comment = {
    async getComments(idMovie) {
        return (await instance.get('/comments/' + idMovie)).data;
    },
    async postComments(data) {
        return (await instance.post('/comments', data)).data;
    }
}

const torrent = {
    async getTorrent(movie_id) {
        return (await instance.get('/torrents/' + movie_id)).data;
    },
    async postTorrent(body) {
        return (await instance.post('/torrents', body)).data;
    }
}

const sub = {
    async subDL(imdb_id) {
        return (await player.get('/subdl/' + imdb_id)).data;
    },
    async getUserLg(jwt) {
        return (await instance.get('/users/my-account/' + jwt)).data;
    }
}

export default {
    test,
    user,
    auth,
    movie,
    comment,
    torrent,
    sub
}
