<<template>
    <div>
        <v-toolbar color="#23272A" dark tabs>
            <v-btn @click="home" icon left large dark><v-icon large>home</v-icon></v-btn>
            <v-spacer></v-spacer>
                <v-flex>
                    <v-form @submit.prevent="search" ref="search">
                        <v-layout row>
                            <v-text-field
                                class="mx-3"
                                flat
                                label="Search"
                                v-model="keywords"
                                prepend-inner-icon="search"
                                solo-inverted
                                v-on:keyup.enter="search"
                            ></v-text-field>
                        </v-layout>
                    </v-form>
                </v-flex>
            <v-spacer></v-spacer>
            <v-btn :to="profilePath" icon large home dark><v-icon large>person</v-icon></v-btn>
            <v-btn @click="logout" icon large home dark><v-icon large>logout</v-icon></v-btn>
        </v-toolbar>
    </div>
</template>
<script>
import { getCookie, deleteCookie } from '@/plugins/cookie.js';
import api from '../api/api'

export default {

    data: () => ({
        keywords:'',
        isLogged : false,
        profilePath: '',
        randomMovie : ''
    }),

    methods: {
        search() {
            this.$router.push('/')
            this.$root.$emit('search', this.keywords)
        },

        async logout() {
            deleteCookie('token');
            this.$root.$emit('checkCookie');
            this.$router.push('/login');
        },

        home() {
            this.$router.push('/')
            this.keywords = ''
            this.$root.$emit('home', '')
        }
    },

    async beforeMount() {
        this.profilePath = '/profile'
    }
}
</script>
