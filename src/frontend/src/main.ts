import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import Overview from './views/Overview.vue';
import NotFound from './views/NotFound.vue';
import Transactions from './views/Transactions.vue';
import Blocks from './views/Blocks.vue';
import Addresses from './views/Addresses.vue';
import Account from './views/Account.vue';
import Send from './views/Send.vue';

import App from './App.vue';

import 'virtual:windi.css';

import './assets/nord.css';
import './assets/global.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: Overview,
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions,
    },
    {
      path: '/blocks',
      name: 'Blocks',
      component: Blocks,
    },
    {
      path: '/Addresses',
      name: 'Addresses',
      component: Addresses,
    },
    {
      path: '/Account',
      name: 'Account',
      component: Account,
    },
    {
      path: '/Send',
      name: 'Send',
      component: Send,
    },
    { path: '/:catchAll(.*)', name: 'NotFound', component: NotFound },
  ],
});

createApp(App).use(router).mount('#app');
