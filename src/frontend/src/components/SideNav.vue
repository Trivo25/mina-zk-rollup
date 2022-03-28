<template>
  <nav class="bg dark:bg-dark">sde nav</nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.bg {
  height: 100vh;
  width: 200px;
  position: sticky;
  z-index: 1;
  top: 25px;
  left: 0;
  overflow-x: hidden;
  padding-top: 60px;
  transition: 0.2s;
  background-color: var(--nord9) !important;
  box-shadow: 0px 4px 4px black;
}

.dark .dark\:bg-dark {
  background-color: var(--nord1) !important;
  box-shadow: 0px 4px 4px rgb(0, 0, 0);
}
</style>
