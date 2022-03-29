<template>
  <div class="overview">
    <h1 class="tag" style="text-align: center !important">Addresses</h1>

    <div class="content">
      <table>
        <tr>
          <th>Address</th>
          <th>Balance</th>
          <th>Nonce</th>
          <th></th>
        </tr>
        <tr v-for="(acc, a) in accounts">
          <td style="cursor: pointer">
            <a @click="copyToClipboard(a.toString())">{{
              crop(a.toString())
            }}</a>
          </td>

          <td>{{ acc.balance.value }} MINA</td>
          <td>{{ acc.nonce.value }}</td>
          <td>{{ acc.username ? acc.username : 'unknown' }}</td>
        </tr>
      </table>
      <div class="refresh" @click="refreshAccounts()">
        <refresh style="font-size: 4rem; padding: 5px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import refresh from '~icons/el/refresh';
import axios from 'axios';
import nanoToMina from '../../../lib/helpers/nanoToMina';
import { ref, onMounted } from 'vue';

const accounts = ref();

onMounted(async () => {
  let res = await axios.get('http://localhost:5000/query/addresses');
  accounts.value = res.data;
  console.log(accounts.value);
});

const refreshAccounts = async () => {
  let res = await axios.get('http://localhost:5000/query/addresses');
  accounts.value = res.data;
};

const copyToClipboard = (s: string) => {
  navigator.clipboard.writeText(s);
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
  width: 51px;
  height: auto;
}
.refresh:hover {
  cursor: pointer;
  color: var(--nord12);
}
</style>
