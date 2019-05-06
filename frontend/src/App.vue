<template>
  <v-app id="app">
    <Navbar ref="nav" v-if="isLogged"></Navbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Home from './components/Home';
import Register from './components/Register';
import Navbar from './components/Navbar'
import Login from './views/Login';
import Profile from './components/Profile';
import { getCookie } from '@/plugins/cookie.js';

export default {
  name: 'app',
  components: {
    Navbar,
    Home,
    Register,
    Profile,
    Login,
  },

  data : () => ({
    isLogged : false
  }),

  methods : {
    async checkCookie() {
      let cookie = await getCookie('token');
      // console.log('Document.cookie : ', document.cookie);
      this.isLogged = (cookie !== undefined && cookie !== "");
      cookie = '';
    }
  },

  mounted () {
    this.checkCookie();
    this.$root.$on('checkCookie', this.checkCookie);
  },
};
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #2C2F33;
}
</style>
