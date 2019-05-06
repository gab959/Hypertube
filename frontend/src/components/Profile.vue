<template>
    <v-container>
        <v-layout justify-center>
            <v-flex xs12 md6>
                <v-card v-if="success === true">
                    <v-card-text>
                        <v-layout>
                            <v-flex xs4>
                                <v-avatar
                                    title="Image de profil"
                                    size="100"
                                >
                                    <img :src="picture" alt="avatar">
                                </v-avatar>
                            </v-flex>
                            <v-flex xs8>
                                <h2>{{ username }}</h2>
                                <div>
                                    {{firstname}} {{lastname}}<br>
                                    Language : {{language}}
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-card v-else>
                    <v-card-title>
                        <h2>Error: Profile not found</h2>
                    </v-card-title>
                    <v-card-text>
                        <p>Please search for an other profile.</p>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import api from "../api/api.js";
import { getCookie } from '@/plugins/cookie.js';

export default {
    data: () => ({
        success: false,
        username: '',
        firstname: '',
        lastname: '',
        picture: '',
        language: ''
    }),

    async mounted () {
        const cookie = await getCookie('token');
        if (cookie === undefined || cookie === "")
            this.$router.push('/login');
        else {
            let res = await api.user.profile(this.$route.params.username);
            if (res.status === "success") {
                this.success = true;
                this.username = res.data.username;
                this.firstname = res.data.firstname;
                this.lastname = res.data.lastname;
                this.picture = "/picture/" + res.data.picture;
                this.language = res.data.language;
            } else {
                this.success = false;
            }
        }
    }
}
</script>

