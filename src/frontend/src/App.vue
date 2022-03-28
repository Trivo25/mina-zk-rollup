<template>
  <Header />
  <SideNav />
  <router-view></router-view>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import SideNav from './components/SideNav.vue';
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
}

.dark {
  background-color: var(--nord3);
  transition: 0.2s; /* 0.5 second transition effect to slide in the sidenav */
}

html {
  background-color: var(--nord6);
  overflow: hidden;
}
</style>
