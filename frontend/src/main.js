import Vue from 'vue';
import login from './views/Login.vue';
import App from './App.vue';
import 'vuetify/dist/vuetify.min.css'
import './plugins/vuetify'
import register from './components/Register'
import home from './components/Home'
import VueRouter from 'vue-router'
import profile from './components/Profile'
import userProfile from './components/UserProfile'
import passwordForget from './components/PasswordForget'
import resetPassword from './components/ResetPassword'
import show from './components/Show.vue'
import notFound from './components/notFound'

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', component: home},
    {path: '/register', component: register},
    {path: '/profile', component: userProfile},
    {path: '/profile/password', component: passwordForget},
    {path: '/profile/password/:key', component: resetPassword},
    {path: '/profile/:username', component: profile},
    {path: '/404', component: notFound},
    {path: '/login', component: login },
    {path: '/movie/:id', component: show, name: "movie"},
    {path: '*', redirect: '/404'}
  ]
})
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
