<template>
  <nav class="bg-blue-600 rounded-b-s">
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
              src="../assets/Logo.svg"
              alt="Rollup"
            />
            <img
              class="hidden lg:block h-8 w-auto"
              src="../assets/Logo.svg"
              alt="Rollup"
            />
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <a
                href="#"
                class="
                  border-gray-400
                  text-white
                  border
                  px-3
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                "
                aria-current="page"
                >Overview</a
              >

              <a
                href="#"
                class="
                  text-gray-300
                  border-0
                  px-3
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                "
                >Accounts</a
              >

              <a
                href="#"
                class="text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >Transactions</a
              >

              <a
                href="#"
                class="text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                >Stats</a
              >
            </div>
          </div>
        </div>
        <div
          class="
            absolute
            inset-y-10
            right-10
            flex
            items-center
            pr-6
            sm:static sm:inset-auto sm:ml-6 sm:pr-0
          "
        >
          <img src="../assets/octocat.svg" />
          <span style="opacity: 0">1adddd</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// defineProps<{ msg: string }>();

// const count = ref(0);
</script>

<style scoped></style>
