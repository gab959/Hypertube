<template>
     <v-container fluid>
        <v-layout justify-center align-center row fill-height>
            <v-flex xs12 md6>
                <v-card>
                    <v-card-title>
                        <h2>Password forget</h2>
                    </v-card-title>
                    <v-card-text v-if="error">
                        <v-alert
                            :value="true"
                            color="error"
                            icon="warning"
                            outline
                    >
                        {{error}}
                    </v-alert>
                    </v-card-text>
                    <v-card-text class="text-sm-left" v-if="!success">
                        Please enter your new password
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                            @submit.prevent="resetPassword"
                        >
                            <v-text-field
                                    v-model="password"
                                    :rules="passwordRules"
                                    label="Password"
                                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                                    :type="showPassword ? 'text' : 'password'"
                                    @click:append="showPassword = !showPassword"
                                    required
                                    @keyup.enter="resetPassword()"
                            ></v-text-field>
                            <v-btn block
                                    :disabled="!valid"
                                    color="success"
                                    @click="resetPassword()"
                            >
                                Valid
                            </v-btn>
                        </v-form>
                    </v-card-text>
                    <v-card-text class="text-sm-left" v-else>
                        <p>Password reset with success.</p>
                        <router-link to="/login">Login</router-link>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
     </v-container>
</template>

<script>
import api from "../api/api.js";
import { getCookie } from "../plugins/cookie.js";

export default {
    data: () => ({
        valid: true,
        password: '',
        passwordRules: [
            v => !!v || 'Password is required',
            v => (v && v.length > 5) || 'Password must be more than 5 characters',
            v => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(v) || 'Password must contain: at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number.'
        ],
        showPassword: false,
        error: '',
        success: false
    }),

    methods: {
        async resetPassword() {
            this.error = '';
            let body = {
                key: this.$route.params.key,
                password: this.password
            }
            let res = await api.user.resetPassword(body);
            if (res.status === "failure" && typeof res.message !== "undefined") {
                this.error = res.message;
            } else if (res.status === "failure") {
                this.error = res.data.message;
            } else {
                this.success = true;
            }
        }
    },

    async beforeMount() {
        const cookie = await getCookie('token');
        if (cookie !== undefined && cookie !== "") {
            this.$router.push('/');
        }
    }
}
</script>
