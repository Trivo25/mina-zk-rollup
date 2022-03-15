<template>
  <Header />
  <router-view></router-view>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
}

.dark {
  background-color: var(--nord3);
}

html {
  background-color: var(--nord6);
}
</style>
