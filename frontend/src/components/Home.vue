<template>
    <v-container style="margin: 0; padding: 0" fluid>
        <v-progress-linear height="3" style="margin: 0" :active="loading" :indeterminate="true"></v-progress-linear>
            <v-expansion-panel dark>
                <v-expansion-panel-content style="background-color: #141516">
                    <template v-slot:header>
                        <h3><v-icon>filter_list</v-icon> Filters</h3>
                    </template>
                    <v-flex>
                        <v-layout row justify-center>
                            <v-flex md2 style="margin: 10px">
                                <v-select
                                    clearable
                                    dark
                                    solo
                                    v-model="param.genre"
                                    :items="genreList"
                                    label="Genre"
                                ></v-select>
                            </v-flex>
                            <v-flex md2 style="margin: 10px">
                                <v-select
                                    :items="sortList"
                                    v-model="param.sort"
                                    solo
                                    dark
                                    label="Sort by"
                                ></v-select>
                            </v-flex>
                            <v-btn small icon @click="ascending" style="margin-top: 20px"><v-icon :color="sortColor1">arrow_upward</v-icon></v-btn>
                            <v-btn small icon @click="descending" style="margin-top: 20px"><v-icon :color="sortColor2">arrow_downward</v-icon></v-btn>
                        </v-layout>
                        <v-layout justify-center align-center row md4 style="margin: 20px">
                            <v-layout>
                                <v-flex style="text-align: center">
                                    <h3>Minimum score</h3>
                                    <v-rating
                                        color="yellow"
                                        v-model="param.minRating"
                                        half-increments
                                        hover
                                    ></v-rating>
                                </v-flex>
                            </v-layout>
                            </v-layout>
                        <v-layout justify-center>
                            <v-flex align-center md6 style="margin: 10px">
                                <v-btn @click="search" block dark color="#7289DA" style="height: 48px"><h3>Apply</h3></v-btn>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-expansion-panel-content>
            </v-expansion-panel>
        <v-item-group>
            <v-container grid-list-md style="margin: 0; padding: 0" fluid>
                <v-layout wrap>
                    <v-flex
                        v-for="(n, index) in movieList"
                        :key="index"
                        xs12
                        sm6
                        md3
                        lg3
                        xl2>
                    <v-item>
                        <v-hover>
                            <v-card
                                slot-scope="{ hover }"
                                class="d-flex align-center"
                                dark
                                :to="/movie/ + n.id"
                                v-if="watched(n.id) === false"
                            >
                            <v-img :src="n.medium_cover_image" @error="n.medium_cover_image = 'http://127.0.0.1:13000/images/unavailable.jpg'">
                                <v-expand-transition>
                                    <div
                                        v-if="hover"
                                        class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal white--text"
                                        style="height: 100%; background-color: #23272A; opacity: 0.9;"
                                    >
                                        <span>
                                            <v-card-title primary-title>
                                                <h2>{{n.title}} ({{n.year}})</h2>
                                            </v-card-title>
                                            <v-layout row justify-center>
                                                <img style="width: 40px; height: 20px; margin-top: 10px; margin-right: 8px" src="/picture/yts.png">
                                                <v-rating color="yellow" half-increments readonly :value="n.rating / 2"></v-rating>
                                            </v-layout>
                                            <v-layout row justify-center>
                                                <img style="width: 30px; height: 20px; margin-bottom: 20px; margin-right: 8px" src="/picture/imdb.png">
                                                <p>{{n.imdb_rating}}/10</p>
                                            </v-layout>
                                            <v-card-title>
                                                <p class="text">{{n.synopsis}}</p>
                                            </v-card-title>
                                        </span>
                                    </div>
                                </v-expand-transition>
                            </v-img>
                            </v-card>
                            <v-card
                                slot-scope="{ hover }"
                                class="d-flex align-center"
                                dark
                                :to="/movie/ + n.id"
                                v-else
                            >
                            <v-img
                            :src="n.medium_cover_image"
                            @error="n.medium_cover_image = 'http://127.0.0.1:13000/picture/unavailable.jpg'"
                            gradient="to top right, rgba(50,40,50,.75), rgba(50,40,50,.75)"
                            >
                                <v-expand-transition>
                                    <div
                                        v-if="hover"
                                        class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal white--text"
                                        style="height: 100%; background-color: #23272A; opacity: 0.9;"
                                    >
                                        <span>
                                            <v-card-title primary-title>
                                                <h2>{{n.title}} ({{n.year}})</h2>
                                            </v-card-title>
                                            <v-layout row justify-center>
                                                <img style="width: 40px; height: 20px; margin-top: 10px; margin-right: 8px" src="/picture/yts.png">
                                                <v-rating color="yellow" half-increments readonly :value="n.rating / 2"></v-rating>
                                            </v-layout>
                                            <v-layout row justify-center>
                                                <img style="width: 30px; height: 20px; margin-bottom: 20px; margin-right: 8px" src="/picture/imdb.png">
                                                <p>{{n.imdb_rating}}/10</p>
                                            </v-layout>
                                            <v-card-title>
                                                <p class="text">{{n.synopsis}}</p>
                                            </v-card-title>
                                        </span>
                                    </div>
                                </v-expand-transition>
                            </v-img>
                            </v-card>
                        </v-hover>
                    </v-item>
                    </v-flex>
                </v-layout>
                <v-btn v-if="displayScrollTop" fab medium style="position: sticky; z-index: 999" bottom left @click="scrollTop"><v-icon>keyboard_arrow_up</v-icon></v-btn>
            </v-container>
        </v-item-group>
        <v-flex>
            <div v-if="movieList === undefined" style="background-color: #2C2F33; color: white; font-size: 30px; margin-top: 8%">No match found...</div>
        </v-flex>
    </v-container>
</template>
<script>
import api from '../api/api'
import { setTimeout } from 'timers';
import { getCookie } from '@/plugins/cookie.js';

export default {
    name:"home",
    data: () => ({
        displayScrollTop: false,
        movieList: '',
        movieWatch: [],
        canCall: true,
        searchCanCall: true,
        sortColor1: 'grey',
        sortColor2: '#7289DA',
        genreList: [
            'Action',
            'Adventure',
            'Animation',
            'Comedy',
            'Crime',
            'Documentary',
            'Drama',
            'Family',
            'Fantasy',
            'History',
            'Horror',
            'Music',
            'Mystery',
            'Romance',
            'Science Fiction',
            'Thriller',
            'TV Movie',
            'War',
            'Western'],
        sortList: [
            'Title',
            'Popularity',
            'Year',
            'Likes',
            'Most recent'
        ],
        param: {
            page: 1,
            sort: 'Popularity',
            genre: '',
            order: -1,
            keywords: '',
            minRating: 0
        },
        loading: false,
        end: false
    }),

    methods: {

        async search() {
            if (this.searchCanCall) {
                this.loading = true
                this.displayScrollTop = false
                this.end = false
                this.param.page = 1
                this.searchCanCall = false

                if (this.param.keywords === '')
                    this.movieList = this.parseImages(await api.test.movies(this.param))

                else {
                    let searchParams = this.param;

                    searchParams.order = 1;
                    searchParams.sort = 'Title'
                    this.movieList = this.parseImages(await api.test.movies(searchParams))
                }

                this.loading = false
                this.end = this.movieList == undefined ? true : this.movieList.length < 20
                this.param.page += 1
                setTimeout(() =>{this.searchCanCall = true}, 500)
            }
        },

        parseImages(movieList) {
            if (movieList) {
                for (let i in movieList) {
                    if (!movieList[i].hasOwnProperty('medium_cover_image') || movieList[i].medium_cover_image == "images/posterholder.png" || movieList[i].medium_cover_image == 'http://image.tmdb.org/t/p/original/null')
                        movieList[i].medium_cover_image = '/picture/unavailable.jpg'
                }
            return movieList
            }
        },

        ascending() {
            this.param.order=1
            this.sortColor1='#7289DA'
            this.sortColor2='grey'
        },

        descending() {
            this.param.order=-1
            this.sortColor1='grey'
            this.sortColor2='#7289DA'
        },

        scrollTop() {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        },

        infiniteScroll() {
            window.onscroll = async () => {
                if (this.$options._componentTag === 'Home' &&
                    !this.end &&
                    this.canCall &&
                    document.documentElement.scrollTop + window.innerHeight > document.documentElement.offsetHeight - 1000)
                    {
                        this.canCall = false
                        let res = this.parseImages(await api.test.movies(this.param))
                        this.end = this.movieList == undefined ? true : this.movieList.length < 20
                        this.param.page += 1
                        this.concatNoDups(res)
                        this.displayScrollTop = true
                        setTimeout(() => { this.canCall = true }, 500)
                }
            }
        },

        concatNoDups(array) {
            let duplicate
            if (array) {
                array.forEach((element) => {
                    duplicate = this.movieList.some((movie) => {
                        return movie.title === element.title
                })
                if (!duplicate)
                    this.movieList.push(element)
            });
            }
        },

        watched(id) {
            if (typeof this.movieWatch.movies !== "undefined" && this.movieWatch.movies.includes(""+id)) {
                return true;
            }
            return false;
        }
    },
    beforeMount() {
        this.$options._componentTag = 'Home'
    },

    beforeDestroy() {
        this.$options._componentTag = undefined
        this.$root.$off()
    },

    async mounted() {
        const cookie = await getCookie('token');
        if (cookie === undefined || cookie === "")
            this.$router.push('/login');
        this.movieWatch = await api.user.getMovie(getCookie('token'));
        this.movieList = this.parseImages(await api.test.movies(this.param))
        this.end = this.movieList == undefined ? true : this.movieList.length < 20
        this.param.page += 1
        this.infiniteScroll()
        this.$root.$on('search', (keywords) => {
            this.param.keywords = keywords
            this.search()
        })
        this.$root.$on('home', () => {
            this.param = {
                page: 1,
                sort: 'Popularity',
                genre: '',
                order: -1,
                keywords: '',
                minRating: 0
            }
            this.search()
        })
    }
}
</script>
<style>
.text {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   line-height: 16px;
   max-height: 144px;
   -webkit-line-clamp: 9;
   -webkit-box-orient: vertical;
}
</style>
