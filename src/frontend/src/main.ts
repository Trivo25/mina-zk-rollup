import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import Overview from './views/Overview.vue';

import App from './App.vue';

import 'virtual:windi.css';

import './assets/nord.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: Overview,
    },
  ],
});

createApp(App).use(router).mount('#app');
