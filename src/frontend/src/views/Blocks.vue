<template>
  <div class="overview">
    <h1 class="tag" style="text-align: center !important">Blocks</h1>

    <div class="content">
      <div class="input-container">
        <search class="icon dark:icon-dark" />
        <input
          class="input-field searchbar"
          type="text"
          placeholder="State Root"
          v-model="searchHash"
        />
      </div>

      <table>
        <tr>
          <th>Block</th>
          <th>Status</th>
          <th>New Root</th>
          <th>Previous Root</th>
          <th>Transactions</th>
          <th>Time</th>
        </tr>

        <template v-for="(block, b) in computedBlocks">
          <tr>
            <td>{{ blocks.length - b }}</td>
            <td>
              <span class="status" :class="block.status">
                {{ block.status }}</span
              >
            </td>
            <td>{{ crop(block.new_state_root) }}</td>
            <td>{{ crop(block.previous_state_root) }}</td>
            <td>{{ block.transactions.length }}</td>
            <td>{{ new Date(parseInt(block.time)).toLocaleTimeString() }}</td>
          </tr>
        </template>
      </table>
      <div @click="refreshBlocks()" class="refresh">
        <refresh style="font-size: 2rem" />
        <span style="font-size: 0.8rem">Refresh</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import refresh from '~icons/el/refresh';
import axios from 'axios';
import search from '~icons/carbon/search';

import { ref, onMounted, computed } from 'vue';

const blocks = ref();
const searchHash = ref();
searchHash.value = '';
const computedBlocks = computed(() => {
  if (searchHash.value === '') return blocks.value;
  else
    return blocks.value.filter((block: any) => {
      if (
        block.new_state_root
          .toLowerCase()
          .includes(searchHash.value.toLowerCase()) ||
        block.previous_state_root
          .toLowerCase()
          .includes(searchHash.value.toLowerCase())
      )
        return block;
    });
});

onMounted(async () => {
  let res = await axios.get('https://api.technotro.com/query/blocks');
  blocks.value = res.data;
});

const refreshBlocks = async () => {
  let res = await axios.get('https://api.technotro.com/query/blocks');
  blocks.value = res.data;
};

const crop = (s: string) => {
  return `${s.slice(0, 8)}...${s.slice(s.length - 8, s.length)}`;
};
</script>

<style scoped>
.overview {
  position: absolute;
  height: auto;
  left: 250px;
  top: 50px;
  padding: 25px;
  display: inline;
  width: calc(100% - 250px);
  text-align: center !important;
}
.content {
  position: fixed;
  width: auto;
  height: auto;
  left: 250px;
  top: 60px;
  margin: 20px;
  margin-top: 60px;
  right: 0;
  bottom: 0;
}
.tag {
  font-size: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}
table th {
  text-align: left;
  padding: 5px;
  background-color: var(--nord10);
  color: white;
  height: 30px;
}

tr {
  text-align: left;
  height: 40px;
  margin-left: 15px;
}

tr:nth-child(odd) {
  background-color: var(--nord4);
}
.refresh {
  position: relative;
  width: 50px;
  height: auto;
  text-align: center;
}
.refresh:hover {
  cursor: pointer;
  color: var(--nord12);
}

.status {
  padding: 3px;
  font-weight: 600;
}
.pending {
  background-color: var(--nord12);
}
.executed {
  background-color: var(--nord14);
}

.failed {
  background-color: var(--nord11);
}

/* Style the input container */
.input-container {
  display: flex;
  width: 600px;
  border-width: 1px;
  border-color: black;
  margin: 15px;
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

.status {
  padding: 3px;
  font-weight: 600;
}
.pending {
  background-color: var(--nord12);
}
.executed {
  background-color: var(--nord14);
}

.failed {
  background-color: var(--nord11);
}
</style>
