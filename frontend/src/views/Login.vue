<template>
    <v-container>
        <v-layout justify-center align-center fill-height row>
            <v-flex xs12 sm6 md6>
                <v-card style="padding-bottom:5%">
                    <v-alert
                            v-if="snackbar"
                            :value="true"
                            color="error"
                            icon="warning"
                            outline
                    >
                        <div v-for="message in snackbarText">
                            {{ message }}<br>
                        </div>
                    </v-alert>
                    <v-card-text v-if="isLogged === false">
                        <v-form
                                ref="form"
                                v-model="valid"
                                lazy-validation
                        >
                            <v-text-field
                                    v-model="username"
                                    :rules="usernameRules"
                                    label="Username"
                                    required
                            ></v-text-field>

                            <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    label="Password"
                                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                                    :type="showPassword ? 'text' : 'password'"
                                    @click:append="showPassword = !showPassword"
                                    required
                                    @keyup.enter="login()"
                            ></v-text-field>

                            <v-btn block
                                   :disabled="!valid"
                                   color="success"
                                   @click="login()"
                            >
                                Validate
                            </v-btn>
                        </v-form>

                        <a href="http://127.0.0.1:13000/auth/42">
                            <img src="@/assets/42.png" class="logo" title="Sign in with 42" />
                        </a>
                            <a href="http://127.0.0.1:13000/auth/google">
                            <img src="@/assets/google.png" class="logo" title="Sign in with Google"/>
                        </a>
                        <a href="http://127.0.0.1:13000/auth/instagram">
                            <img src="@/assets/instagram.png" class="logo" title="Sign in with Instagram"/>
                        </a>
                        <a href="http://127.0.0.1:13000/auth/spotify">
                            <img src="@/assets/spotify.png" class="logo" title="Sign in with Spotify"/>
                        </a>
                        <a href="http://127.0.0.1:13000/auth/github">
                            <img src="@/assets/github.png" class="logo" title="Sign in with Github"/>
                        </a>
                    </v-card-text>
                    <v-flex>
                        <router-link to="/register">Register</router-link>
                    </v-flex>
                    <v-flex>
                        <router-link to="/profile/password">Password lost ?</router-link>
                    </v-flex>
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
            valid: true,
            username: '',
            usernameRules: [
                v => !!v || 'Username is required',
            ],
            showPassword: false,
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
            ],
            select: null,
            isLogged: false,
            snackbar: false,
            snackbarText: []
        }),
        methods: {
            async login() {
                this.snackbar = false;
                this.snackbarText = [];
                if (this.$refs.form.validate()) {
                    let body = {
                        username: this.username,
                        password: this.password
                    };
                    let res = await api.auth.login(body);
                    console.log('Login res : ', res);
                    if (res.status === 'success') {
                        this.isLogged = true;
                        document.cookie = "token=" + res.cookie + "; path=/";
                        this.$root.$emit('checkCookie');
                        this.$router.push('/');
                        this.$router.go('/');
                    } else if (res.status === 'failure') {
                        this.snackbarText.push(res.message);
                        this.snackbar = true;
                    }
                }
            }
		},
        beforeMount() {
            const cookie = getCookie('token');
            if (cookie !== undefined && cookie !== "") {
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>
    .logo {
        max-width: 12%;
        max-height:12%;
        margin: 12px;
    }
</style>
