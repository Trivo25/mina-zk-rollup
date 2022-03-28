<template>
  <nav class="bg dark:bg-dark">
    <ul>
      <router-link to="/">
        <li :class="$route.name == 'Overview' ? 'selected' : 'selecteable'">
          <div class="logo"><overview class="i" /></div>
          <span class="nav-item">Overview</span>
        </li>
      </router-link>
      <router-link to="Transactions">
        <li :class="$route.name == 'Transactions' ? 'selected' : 'selecteable'">
          <div class="logo"><tx class="i" /></div>
          <span class="nav-item">Transactions</span>
        </li>
      </router-link>
      <router-link to="Blocks">
        <li :class="$route.name == 'Blocks' ? 'selected' : 'selecteable'">
          <div class="logo"><block class="i" /></div>
          <span class="nav-item">Blocks</span>
        </li>
      </router-link>
      <router-link to="Accounts">
        <li :class="$route.name == 'Accounts' ? 'selected' : 'selecteable'">
          <div class="logo"><accounts class="i" /></div>
          <span class="nav-item">Accounts</span>
        </li>
      </router-link>
      <hr class="menu-seperator" />
      <router-link to="Account">
        <li :class="$route.name == 'Account' ? 'selected' : 'selecteable'">
          <div class="logo"><user class="i" /></div>
          <span class="nav-item">Account</span>
        </li>
      </router-link>
      <router-link to="Send">
        <li :class="$route.name == 'Send' ? 'selected' : 'selecteable'">
          <div class="logo"><send class="i" /></div>
          <span class="nav-item">Send</span>
        </li>
      </router-link>
    </ul>

    <div class="footer">
      <h1>zk-Rollup</h1>
      <a href="https://github.com/Trivo25/mina-zk-rollup" target="_blank"
        ><github />GitHub</a
      >
    </div>
  </nav>
</template>

<script setup lang="ts">
import block from '~icons/octicon/package-16';
import tx from '~icons/carbon/DataShare';
import overview from '~icons/carbon/Dashboard';
import accounts from '~icons/carbon/Events';
import send from '~icons/carbon/Export';
import user from '~icons/carbon/UserOnline';

import github from '~icons/carbon/LogoGithub';
</script>

<style scoped>
.bg {
  height: 100vh;
  width: 250px;
  z-index: 1;
  top: 60px;
  left: 0;
  overflow-x: hidden;
  padding-top: 30px;
  transition: 0.2s;
  border-right: 1px solid black;
  position: absolute;

  /*   background-color: var(--nord9); */
  /*   box-shadow: 0px 4px 4px black; */
}

.dark .dark\:bg-dark {
  /*   background-color: var(--nord1);
 */
  /*   box-shadow: 0px 4px 4px rgb(0, 0, 0); */
}

ul {
  padding: 10px;
}

li {
  color: white;
  margin: 25px;
  font-weight: 500;
  position: relative;
  display: flex;
  height: 40px;
  justify-content: space-between;
  border-width: 1px;
  border-color: black;
  cursor: pointer;
  transition: 0.5s;
  border-right: 1px solid var(--nord1);
}

.selecteable:hover {
  transition: 0.5s;
  border-right: 6px solid var(--nord13);
}

.selected {
  border-right: 6px solid var(--nord13);
}

.logo {
  width: auto;
  height: 100%;
  padding: 4px;
  background-color: var(--nord11);
}

.logo .i {
  width: 30px;
  height: auto;
}

.nav-item {
  width: 100%;
  background-color: var(--nord4);
  line-height: 40px;
  justify-content: baseline;
  text-align: left;
  padding-left: 10px;
  font-size: 1.3rem;
  color: var(--nord2);
}

.footer {
  position: absolute;
  bottom: 100px;
  margin-top: 50px;
  width: 100%;
  color: var(--nord3);
  line-height: 30px;
}

.menu-seperator {
  margin-left: 5%;
  margin-right: 5%;
  border-width: 2px;
  border-color: var(--nord2);
}
</style>
