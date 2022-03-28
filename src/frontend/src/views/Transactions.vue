<template>
  <div class="overview">
    <h1 class="tag" style="text-align: center !important">Transactions</h1>

    <div class="content">
      <table>
        <tr>
          <th>Tx Hash</th>
          <th>Type</th>
          <th>From</th>
          <th>To</th>
          <th>Amount</th>
          <th>Fee</th>
          <th>Time</th>
        </tr>

        <tr v-for="(tx, t) in transactions">
          <td>{{ crop(tx.hash) }}</td>
          <td>{{ tx.method }}</td>
          <td>{{ crop(tx.from) }}</td>
          <td>{{ crop(tx.to) }}</td>
          <td>{{ tx.amount }} MINA</td>
          <td>{{ tx.fee }} MINA</td>
          <td>{{ new Date(tx.time * 1).toLocaleDateString() }}</td>
        </tr>
      </table>
      <div @click="refreshTx()" class="refresh">
        <refresh style="font-size: 4rem; padding: 5px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import refresh from '~icons/el/refresh';
import axios from 'axios';

import { ref, onMounted } from 'vue';

const transactions = ref();

onMounted(async () => {
  let res = await axios.get('http://localhost:5000/query/transactionPool');
  transactions.value = res.data;
});

const refreshTx = async () => {
  let res = await axios.get('http://localhost:5000/query/transactionPool');
  transactions.value = res.data;
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
