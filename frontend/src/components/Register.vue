<template>
    <v-container>
        <v-layout align-center fill-height justify-center>
            <v-flex xs12 md6>
                <v-card>
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
                    <v-card-text v-if="isRegister === false">
                        <v-form
                                ref="form"
                                v-model="valid"
                                lazy-validation
                        >
                            <v-text-field
                                    v-model="username"
                                    :counter="20"
                                    :rules="usernameRules"
                                    label="Username"
                                    required
                                    @keyup.enter="register()"
                            ></v-text-field>

                            <v-text-field
                                    v-model="email"
                                    :rules="emailRules"
                                    label="E-mail"
                                    required
                                    @keyup.enter="register()"
                            ></v-text-field>

                            <v-text-field
                                    v-model="firstname"
                                    :rules="firstnameRules"
                                    label="Firstname"
                                    required
                                    @keyup.enter="register()"
                            ></v-text-field>

                            <v-text-field
                                    v-model="lastname"
                                    :rules="lastnameRules"
                                    label="Lastname"
                                    required
                                    @keyup.enter="register()"
                            ></v-text-field>

                            <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    label="Password"
                                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                                    :type="showPassword ? 'text' : 'password'"
                                    @click:append="showPassword = !showPassword"
                                    required
                                    @keyup.enter="register()"
                            ></v-text-field>

                            <v-btn block
                                    :disabled="!valid"
                                    color="success"
                                    @click="register()"
                            >
                                Register
                            </v-btn>
                        </v-form>
                    <router-link to="/login">Login</router-link>
                    </v-card-text>
                    <v-card-text v-else>
                        <h2>Successfull register.</h2>
                        <p>You can now <router-link to="/login">login</router-link></p>
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
            valid: true,
            username: '',
            usernameRules: [
                v => !!v || 'Login is required',
                v => (v && v.length <= 20) || 'Login must be less than 20 characters',
                v => /^(?=.{3,20}$)(?![_.-])(?!.*[_.-]{2})[\sA-Za-zÀ-ÖØ-öø-ÿ0-9_-]+([^._-])$/.test(v) || 'Login must contain letters and numbers only'
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/.test(v) || 'E-mail must be valid'
            ],
            firstname: '',
            firstnameRules: [
                v => !!v || 'Firstname is required',
                v => /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{3,}$/.test(v) || 'Firstname must contain letters and space only'
            ],
            lastname: '',
            lastnameRules: [
                v => !!v || 'Lastname is required',
                v => /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{3,}$/.test(v) || 'Lastname must contain letters and space only'
            ],
            showPassword: false,
            password: '',
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length > 5) || 'Password must be more than 5 characters',
                v => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(v) || 'Password must contain: at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number.'
            ],
            select: null,
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4'
            ],
            checkbox: false,
            isRegister: false,
            snackbar: false,
            snackbarText: []
        }),

        methods: {
            async register () {
                this.snackbar = false;
                this.snackbarText = [];
                if (this.$refs.form.validate()) {
                    let body = {
                        username: this.username,
                        email: this.email,
                        firstname: this.firstname,
                        lastname: this.lastname,
                        password: this.password
                    };
                    let res = await api.user.register(body);
                    if (res.status === 'success') {
                        this.isRegister = true
                    } else if (res.status === 'failure' ){
                        for (let i in res.data.errors) {
                            this.snackbarText.push(res.data.errors[i].message);
                        }
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
