
import './assets/lib/normalize.css';
import './style/style.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
// import Vuex from 'vuex';

import Home from './components/Home.vue';
import User from './components/User.vue';
import Work from './components/WorkPage.vue';
import Share from './components/Share.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/work', component: Work },
  { path: '/:user_id', component: User },
  { path: '/:user_id/:work_id', component: Share },
];

const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  router
});
