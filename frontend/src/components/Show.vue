<template>
    <v-container fluid>
        <v-container fluid v-if="play">
            <v-btn round @click="killPlayer()"><v-icon>keyboard_backspace</v-icon> Movie page</v-btn>
            <video  width="100%"
                    id="player2"
                    :poster="screenshot"
                    class="video-js vjs-fluid vjs-big-play-centered">
            </video>
            <div class="" v-if="dl">
                <v-progress-linear
                        color="info"
                        height="10"
                        v-model="progress"
                ></v-progress-linear>
                <p style="color: white">{{progress}}% - {{speed}} Mb/s</p>
            </div>
        </v-container>
        <v-layout v-else-if="loader">
            <v-flex>
                <div class="text-xs-center">
                    <v-progress-circular
                            indeterminate
                            color="white"
                    ></v-progress-circular>
                </div>
            </v-flex>
        </v-layout>
        <v-layout row v-else>
            <v-flex xs12>
                <v-img
                        dark
                        height:100
                        :src="movie.large_screenshot_image1"
                        gradient="to top right, rgba(0,0,0,0.9), rgba(0,0,0,0.9)"
                        class="pa-4"
                >
                    <v-layout row class="white--text">
                        <v-flex xs12 sm12 md4>
                            <v-img
                                    :src="movie.large_cover_image"
                                    max-height:400
                            >
                            </v-img>
                        </v-flex>
                        <v-flex xs12 sm12 md8 class="ml-5 text-xs-left">
                            <h1 class="text-xs-left">{{ movie.title }} ({{movie.year}})</h1>
                            <div class="mt-4">
                                <v-btn :href="link" outline color="white" target="_blank">
                                    Trailer
                                </v-btn>
                                <v-btn  @click="player()" color="primary" class="text-xs-left">
                                    Play
                                </v-btn>
                            </div>
                            <div class="mt-4">
                                <h2>Overview</h2>
                                <p>{{ movie.description_full }}</p>
                            </div>
                            <div class="mt-4">
                                <h2>Genre</h2>
                                <p>{{ genre }}</p>
                            </div>
                            <div class="mt-4">
                                <h2>Casting</h2>
                                <p>
                                <span v-for="character in movie.cast">
                                    <strong>{{character.name}}</strong> as  {{character.character_name}}<br>
                                </span>
                                </p>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-img>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 >
                <v-card
                        dark
                        elevation=6
                        class="mt-2"
                >
                    <v-card-text>
                        <v-form
                                ref="form"
                                v-model="valid"
                                lazy-validation
                        >
                            <v-textarea
                                    v-model="commentMessage"
                                    name="input-7-1"
                                    label="Comment"
                                    :rules="commentMessageRules"
                                    required
                                    dark
                            >
                            </v-textarea>
                            <v-btn block
                                   :disabled="!valid"
                                   color="primary"
                                   @click="postComment()"
                            >
                                New comment
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-card
                        dark
                        v-for="comment in comments"
                        elevation=6
                        class="mt-2"
                >
                    <v-card-text class="text-sm-left">
                        {{comment.comment}}
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import api from "../api/api.js";
    import { getCookie } from '@/plugins/cookie.js';
    import io from 'socket.io-client'

    import 'video.js/dist/video-js.min.css';
    import videojs from 'video.js';

    export default {
        data: () => ({
            play: false,
            movie: '',
            valid: true,
            commentMessage: '',
            commentMessageRules: [
                v => !!v || 'Comment is required',
                v => (v && v.length >= 2) || 'Comment must be more than 2 characters',
            ],
            comments: '',
            magnet: '',
            decodedMagnet: '',
            torrents: [],
            screenshot: '',
            moviePath: '',
            subFR:'',
            subEN:'',
            frLang : false,
            enLang : false,
            isComplete : false,
            progress: 0,
            speed: 0,
            dl: false,
            socket: io('http://127.0.0.1:14000'),
            vjs: '',
            loader: true
        }),

        computed: {
            genre() {
                if (typeof this.movie.genres === "object")
                {
                    let values = Object.values(this.movie.genres);
                    return values.join(', ');
                }
                return "Undefined";
            },
            link() {
                if (typeof this.movie.yt_trailer_code !== "undefined" && this.movie.yt_trailer_code !== "")
                    return "https://youtu.be/" + this.movie.yt_trailer_code;
                return "";
            }
        },

        methods: {
            killPlayer() {
                if (this.vjs) {
                    this.moviePath = '';
                    this.vjs.dispose();
                    this.vjs = ''
                }
                this.play = false;
            },

            async postComment () {
                if (this.$refs.form.validate()) {
                    let body = {
                        comment: this.commentMessage,
                        id_movie: this.$route.params.id,
                        token: getCookie('token')
                    };
                    let res = await api.comment.postComments(body);
                    if (res.status === "success") {
                        this.comments.unshift({comment: this.commentMessage});
                        this.$refs.form.reset();
                    }
                }
            },

            /* Gets user language to set default sub language */
            async loadUserLg() {

                let userLg = await api.sub.getUserLg(getCookie('token'));

                if (userLg.status === "success") {
                    const userLang = userLg.data.language.substring(0, 2);
                    if (userLang === 'fr')
                        this.frLang = true;
                    else
                        this.enLang = true;
                }
            },

            /* Sends request to API to download subs and sets correct track source */
            async loadSubs() {

                await this.loadUserLg();

                const subPath ='http://127.0.0.1:14000/sub/' + this.movie.imdb_code.substr(2);

                let res = await api.sub.subDL(this.movie.imdb_code.substr(2));
                if (res.status === "success") {
                    if (res.sub.en)
                        this.subEN = subPath + '/en';
                    if (res.sub.fr)
                        this.subFR = subPath + '/fr';
                }
            },

            async player() {
                this.play = true;
                let res = await api.torrent.getTorrent(this.$route.params.id);
                let body = {
                    movie_id: this.$route.params.id,
                    token: await getCookie('token')
                };
                api.user.addMovie(body);
                if (res.status === "success") {
                    this.isComplete = res.data.isComplete;
                    this.dl = false;
                    this.enableVideo(res.data.name, this.movie.runtime * 60);
                } else {
                    this.dl = true;
                    this.socket.emit('stream', {
                        totalSize: this.torrents[0].size_bytes,
                        movieId: this.$route.params.id,
                        hash: this.torrents[0].hash
                    });
                }
            },

            async enableVideo(path, runtime) {
                this.moviePath = path + '&time=0';
                let html5Video = document.getElementById('player2');
                if (html5Video !== null) {
                    this.vjs = videojs("player2", {
                        autoplay: true,
                        controls: true,
                        preload: 'auto'
                    });
                    this.vjs.src({type: 'video/mp4', src: this.moviePath})
                    this.vjs.ready(() => {
                        if (this.subEN !== '')
                            this.vjs.addRemoteTextTrack({
                                kind: 'subtitles',
                                language: 'en',
                                label: 'English',
                                src: this.subEN,
                                default : this.enLang,
                            }, true);
                        if (this.subFR !== '')
                            this.vjs.addRemoteTextTrack({
                                kind: 'subtitles',
                                language: 'fr',
                                label: 'Français',
                                src: this.subFR,
                                default : this.frLang
                            }, true);
                        const currentTime = this.vjs.currentTime.bind(this.vjs)
                        let offset = 0
                        this.vjs.duration = () => runtime
                        let vjs = this.vjs
                        this.vjs.currentTime = (time) => {
                            if (time && this.isComplete) {
                                vjs.src({src: `${path}&time=${time}`, type: "video/mp4"})
                                currentTime(0)
                                vjs.player_.scrubbing_ = false
                                vjs.textTracks().tracks_.forEach((track) => {
                                    track.cues_.forEach((cue) => {
                                        cue.startTime = cue.startTime - (time - offset)
                                        cue.endTime = cue.endTime - (time - offset)
                                    })
                                })
                                offset = time
                            }
                            return currentTime() + offset
                        }
                    })

                }
            },

            getHash() {
                let array = this.movie.torrents
                this.torrents = array.sort((a, b) => {
                    return (b.seeds - a.seeds)
                })
            }
        },

        beforeDestroy() {
            if (this.vjs) {
                this.vjs.dispose();
                this.vjs = ''
            }
            this.socket.disconnect()
        },

        beforeMount() {
            if (this.vjs) {
                this.vjs.dispose();
                this.vjs = ''
            }
        },

        async mounted() {
            const cookie = await getCookie('token');
            if (cookie === undefined || cookie === "") {
                this.$router.push('/login');
            } else {
                this.socket.on('id', (id) => {
                })
                let res = await api.movie.details(this.$route.params.id);
                if (res.data.status === "ok") {
                    this.screenshot = res.data.data.movie.large_screenshot_image1;
                    this.movie = res.data.data.movie;
                    await this.loadSubs();
                    this.getHash()
                    this.loader = false;
                }
                let result = await api.comment.getComments(this.$route.params.id);
                if (result.status === "success") {
                    this.comments = result.data;
                    this.comments.reverse();
                } else {
                    this.comments = [];
                }
                let vue = this
                this.socket.on('stream', async (data) => {
                    vue.progress = data.progress;
                    vue.speed = Math.round(data.speed / 1000000 * 100)/100
                    if (vue.progress >= 99 && !this.moviePath.length) {
                        this.enableVideo(data.path, this.movie.runtime * 60)
                        this.socket.disconnect()
                    }
                    if (vue.progress >= 99)
                        this.dl = false;
                })
            }
        }
    }
</script>

<style>
    .v-overlay--active {
        opacity: 0.90;
    }
</style>
