<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav class="bg dark:bg-dark">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div
          class="
            flex-1 flex
            items-center
            justify-center
            sm:items-stretch sm:justify-between
          "
        >
          <div class="flex-shrink-0 flex items-center">
            <img
              class="block lg:hidden h-12 w-auto"
              src="../assets/logo.svg"
              alt="rollup"
            />
            <img
              class="hidden lg:block h-12 w-auto"
              src="../assets/logo.svg"
              alt="rollup"
            />
          </div>

          <div class="hidden sm:block sm:ml-6">
            <div class="input-container">
              <search class="icon dark:icon-dark" />
              <input
                class="input-field searchbar"
                type="text"
                placeholder="Transaction id, block id, address.."
                name="usrnm"
              />
            </div>
          </div>
        </div>

        <div
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            sm:static sm:inset-auto sm:ml-6 sm:pr-0
          "
        >
          <div class="ml-3 relative">
            <div>
              <moon
                v-if="darkMode"
                class="moon mode-toggle"
                @click="setDark()"
              />
              <sun v-else class="sun mode-toggle" @click="setLight()" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import moon from '~icons/carbon/moon';
import sun from '~icons/carbon/sun';
import search from '~icons/carbon/search';

import { ref } from 'vue';
let darkMode = ref(true);

if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
  darkMode.value = false;
} else {
  document.documentElement.classList.remove('dark');
  darkMode.value = true;
}

const setLight = () => {
  localStorage.theme = 'light';
  document.documentElement.classList.remove('dark');
  darkMode.value = true;
};

const setDark = () => {
  localStorage.theme = 'dark';
  document.documentElement.classList.add('dark');
  darkMode.value = false;
};
</script>

<style scoped>
.bg {
  background-color: var(--nord9) !important;
  box-shadow: 0px 0px 4px black;
  transition: 0.2s;
}
.dark .dark\:bg-dark {
  background-color: var(--nord1) !important;
  box-shadow: 0px 0px 2px rgb(0, 0, 0);
}

.moon {
  color: var(--nord10);
}

.sun {
  color: var(--nord13);
}

.mode-toggle {
  font-size: 1.5rem;
  cursor: pointer;
}
.mode-toggle:hover {
  transform: scale(1.1);
}

.searchbar {
  background-color: var(--nord4);
  height: 40px;
}

.menu-item {
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

.menu-item:hover {
  color: black;
}

/* Style the input container */
.input-container {
  display: flex;
  width: 400px;
  border-width: 1px;
  border-color: black;
}

/* Style the form icons */
.icon {
  background: var(--nord10);
  color: white;
  min-width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  padding: 8px;
}

.icon:hover {
  cursor: pointer;
  color: black !important;
}

.dark .dark\:icon-dark {
  background: var(--nord9);
  color: white;
  min-width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  padding: 8px;
}

/* Style the input fields */
.input-field {
  width: 100%;
  padding: 5px;
  outline: none;
}

.input-field:focus {
  outline: none;
  outline-width: 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
