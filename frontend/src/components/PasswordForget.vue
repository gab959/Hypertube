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
                        Please enter your email.
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                            @submit.prevent="validMail"
                        >
                            <v-text-field
                                    v-model="email"
                                    :rules="emailRules"
                                    label="E-mail"
                                    required
                                    @keyup.enter="validMail()"
                            ></v-text-field>
                            <v-btn block
                                    :disabled="!valid"
                                    color="success"
                                    @click="validMail()"
                            >
                                Valid
                            </v-btn>
                            <router-link to="/login">Back</router-link>
                        </v-form>
                    </v-card-text>
                    <v-card-text class="text-sm-left" v-else>
                        <p>Mail send. Please check your mailbox.</p>
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
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/.test(v) || 'E-mail must be valid'
        ],
        valid: true,
        success: false,
        error: ''
    }),

    methods: {
        async validMail() {
            this.error = null;
            if (this.$refs.form.validate()) {
                let res = await api.user.passwordForget(this.email);
                if (res.status === "success") {
                    this.success = true;
                } else {
                    this.error = "Error: your email is not valid.";
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
