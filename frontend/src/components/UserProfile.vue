<template>
    <v-container>
        <v-layout justify-center>
            <v-flex xs12 md6>
                <v-expansion-panel>
                    <v-expansion-panel-content>
                        <template v-slot:header>
                            <h3>Update profile</h3>
                        </template>
                        <v-card>
                             <v-card-text v-if="succesInformation">
                                 <v-alert
                                    :value="true"
                                    color="success"
                                    icon="check_circle"
                                    outline
                                >
                                    {{succesInformation}}
                                </v-alert>
                            </v-card-text>
                            <v-card-text v-if="informationErrors.length > 0">
                                 <v-alert
                                    :value="true"
                                    color="error"
                                    icon="warning"
                                    outline
                                >
                                    <div v-for="message in informationErrors">
                                        {{message}}
                                    </div>
                                </v-alert>
                            </v-card-text>
                            <v-card-text>
                                <v-form
                                        ref="form"
                                        v-model="validProfile"
                                        lazy-validation
                                >
                                    <v-text-field
                                            v-model="username"
                                            :counter="30"
                                            :rules="usernameRules"
                                            :disabled="oauth === true"
                                            label="Username"
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="email"
                                            :rules="emailRules"
                                            :disabled="oauth === true"
                                            label="E-mail"
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="firstname"
                                            :rules="firstnameRules"
                                            label="Firstname"
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="lastname"
                                            :rules="lastnameRules"
                                            label="Lastname"
                                            required
                                    ></v-text-field>

                                    <v-btn block
                                           :disabled="!validProfile"
                                           color="success"
                                           @click="updateGeneral()"
                                    >
                                        Save profile
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                        <template  v-slot:header>
                            <h3>Update profile picture</h3>
                        </template>
                        <v-card>
                            <v-card-text>
                                <v-avatar
                                    :size="100"
                                    :tile="true"
                                >
                                    <img :src="pictureUri" alt="Image 1">
                                </v-avatar>
                            </v-card-text>
                            <v-card-text>
                                <v-layout wrap row>
                                    <v-flex xs6 md4 l3 v-if="picture !== 'hypertube-image1.png'">
                                        <v-avatar
                                            :size="100"
                                            :tile="true"
                                            @click="updatePicture('hypertube-image1.png')"
                                        >
                                            <img src="/picture/hypertube-image1.png" alt="Image 1">
                                        </v-avatar>
                                    </v-flex>
                                    <v-flex xs6 md4 l3 v-if="picture !== 'hypertube-image2.png'">
                                        <v-avatar
                                            :size="100"
                                            :tile="true"
                                            @click="updatePicture('hypertube-image2.png')"
                                        >
                                            <img src="/picture/hypertube-image2.png" alt="Image 1">
                                        </v-avatar>
                                    </v-flex>
                                    <v-flex xs6 md4  l3 v-if="picture !== 'hypertube-image3.png'">
                                         <v-avatar
                                            :size="100"
                                            :tile="true"
                                            @click="updatePicture('hypertube-image3.png')"
                                        >
                                            <img src="/picture/hypertube-image3.png" alt="Image 1">
                                        </v-avatar>
                                    </v-flex>
                                    <v-flex xs6 md4 l3 v-if="picture !== 'hypertube-image4.png'">
                                        <v-avatar
                                            :size="100"
                                            :tile="true"
                                            @click="updatePicture('hypertube-image4.png')"
                                        >
                                            <img src="/picture/hypertube-image4.png" alt="Image 1">
                                        </v-avatar>
                                    </v-flex>
                                    <v-flex xs6 md4 l3 v-if="picture !== 'hypertube-image5.png'">
                                        <v-avatar
                                            :size="100"
                                            :tile="true"
                                            @click="updatePicture('hypertube-image5.png')"
                                        >
                                            <img src="/picture/hypertube-image5.png" alt="Image 1">
                                        </v-avatar>
                                    </v-flex>
                                    <v-flex xs6 md4 l3 v-if="picture !== 'hypertube-image6.png'">
                                        <v-avatar
                                            :size="100"
                                            :tile="true"
                                            @click="updatePicture('hypertube-image6.png')"
                                        >
                                            <img src="/picture/hypertube-image6.png" alt="Image 1">
                                        </v-avatar>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                        <template v-slot:header>
                            <h3>Update password</h3>
                        </template>
                        <v-card>
                            <v-card-text v-if="successPassword">
                                 <v-alert
                                    :value="true"
                                    color="success"
                                    icon="check_circle"
                                    outline
                                >
                                    {{successPassword}}
                                </v-alert>
                            </v-card-text>
                            <v-card-text v-if="passwordErrors.length > 0">
                                 <v-alert
                                    :value="true"
                                    color="error"
                                    icon="warning"
                                    outline
                                >
                                    <div v-for="message in passwordErrors">
                                        {{message}}
                                    </div>
                                </v-alert>
                            </v-card-text>
                            <v-card-text>
                                <v-form
                                    ref="form"
                                    v-model="validPassword"
                                    lazy-validation
                                >
                                    <v-text-field
                                            v-model="currentPassword"
                                            :append-icon="showCurrentPassword ? 'visibility' : 'visibility_off'"
                                            :type="showCurrentPassword ? 'text' : 'password'"
                                            :disabled="oauth === true"
                                            label="Current password"
                                            @click:append="showCurrentPassword = !showCurrentPassword"
                                            required
                                    ></v-text-field>

                                    <v-text-field
                                            v-model="newPassword"
                                            :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                                            :type="showNewPassword ? 'text' : 'password'"
                                            :rules="passwordRules"
                                            :disabled="oauth === true"
                                            label="New password"
                                            @click:append="showNewPassword = !showNewPassword"
                                            required
                                    ></v-text-field>

                                    <v-btn block
                                           :disabled="!validPassword || oauth === true"
                                           color="success"
                                           @click="updatePassword()"
                                    >
                                        Change password
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                        <template v-slot:header>
                            <h3>Settings</h3>
                        </template>
                        <v-card>
                             <v-card-text v-if="errorSettings">
                                 <v-alert
                                    :value="true"
                                    color="error"
                                    icon="warning"
                                    outline
                                >
                                    {{errorSettings}}
                                </v-alert>
                            </v-card-text>
                            <v-card-text>
                                <v-form>
                                    <v-select
                                            :items="languages"
                                            v-model="language"
                                            label="Language"
                                            required
                                    ></v-select>

                                    <v-btn block
                                           :disabled="!validSettings"
                                           color="success"
                                           @click="updateSettings()"
                                    >
                                        Save settings
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import api from "../api/api.js";
    import { createHash } from 'crypto';
    import { getCookie } from '../plugins/cookie.js';

    export default {
        data: () => ({
            validProfile: false,
            username: '',
            usernameRules: [
                v => !!v || 'Login is required',
                v => (v && v.length <= 30) || 'Login must be less than 30 characters',
                v => /^(?=.{3,30}$)(?![_.-])(?!.*[_.-]{2})[\sA-Za-zÀ-ÖØ-öø-ÿ0-9_-]+([^._-])$/.test(v) || 'Login must contain letters and numbers only'
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
            informationErrors: [],
            succesInformation: '',
            validPassword: false,
            currentPassword: '',
            showCurrentPassword: false,
            newPassword: '',
            showNewPassword: false,
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length > 5) || 'Password must be more than 5 characters',
                v => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(v) || 'Password must contain: at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number.'
            ],
            passwordErrors: [],
            successPassword: '',
            language: '',
            languages: ['English', 'French'],
            errorSettings: '',
            picture: '',
            pictureUri: '',
            oauth: ''
        }),

        computed: {
            validSettings: function () {
                if (this.language)
                    return true;
                return false;
            }
        },

        methods: {
            removeErrors() {
                this.passwordErrors = [];
                this.errorSettings = '';
                this.successPassword = '';
                this.succesInformation = '';
                this.informationErrors = [];
            },
            async updatePicture(name) {
                this.removeErrors();
                let body = {
                    picture: name,
                    token: getCookie('token')
                };
                this.$refs.form.reset();
                let res = await api.user.updatePicture(body);
                if (res.status === "success") {
                    this.picture = name;
                    this.pictureUri = "/picture/"+name;
                }
            },
            async updateGeneral() {
                this.removeErrors();
                let body = {
                    username: this.username,
                    email: this.email,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    token: getCookie('token')
                };
                this.$refs.form.reset();
                let res = await api.user.updateGeneral(body);
                 if (res.status === "failure") {
                    for (let i in res.data.errors) {
                        this.informationErrors.push(res.data.errors[i].message);
                    }
                } else {
                    this.succesInformation = "Informations changed with success.";
                }
            },
            async updatePassword() {
                this.removeErrors();
                let body = {
                    currentPassword: this.currentPassword,
                    newPassword: this.newPassword,
                    token: getCookie('token')
                };
                this.$refs.form.reset();
                let res = await api.user.updatePassword(body);
                if (res.status === "failure") {
                    for (let i in res.data.errors) {
                        this.passwordErrors.push(res.data.errors[i].message);
                    }
                } else {
                    this.currentPassword = '';
                    this.newPassword = '';
                    this.$refs.form.reset();
                    this.successPassword = "Password changed with success.";
                }
            },
            async updateSettings() {
                this.removeErrors();
                let body = {
                    language: this.language,
                    token: getCookie('token')
                };
                this.$refs.form.reset();
                let res = await api.user.updateSetting(body);
                if (res.status === "failure") {
                    errorSettings = res.data.language.message;
                }
            }
        },

        async mounted () {
            const cookie = await getCookie('token');
            if (cookie === undefined || cookie === "")
                this.$router.push('/login');
            let res = await api.user.account(cookie);
            if (res.status === "success") {
                this.oauth = res.data.oauth;
                this.username = res.data.username;
                this.email = res.data.email;
                this.firstname = res.data.firstname;
                this.lastname = res.data.lastname;
                this.picture = res.data.picture;
                this.pictureUri = "/picture/" + this.picture;
                this.language = res.data.language.charAt(0).toUpperCase() + res.data.language.slice(1);
            }
        }
    }
</script>
