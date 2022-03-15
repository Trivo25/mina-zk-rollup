import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';
import Stats from './views/Stats.vue';

import App from './App.vue';

import 'virtual:windi.css';

import './assets/nord.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/stats',
      name: 'Stats',
      component: Stats,
    },
  ],
});

createApp(App).use(router).mount('#app');
