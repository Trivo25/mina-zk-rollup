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
            sm:items-stretch sm:justify-start
          "
        >
          <div class="flex-shrink-0 flex items-center">
            <img
              class="block lg:hidden h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
              alt="Workflow"
            />
            <img
              class="hidden lg:block h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
              alt="Workflow"
            />
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <a
                href="#"
                class="
                  bg-gray-900
                  text-white
                  px-3
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                "
                aria-current="page"
                >Dashboard</a
              >

              <a
                href="#"
                class="
                  text-gray-300
                  hover:bg-gray-700 hover:text-white
                  px-3
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                "
                >Calendar</a
              >
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
          <!-- Profile dropdown -->
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
  background-color: var(--nord1) !important;
}

.bg-dark {
  background-color: var(--nord14) !important;
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
</style>
