<template>
  <div class="overview">
    <h1 class="tag" style="text-align: center !important">Overview</h1>
    <div class="content">
      <div class="stats">
        <div class="top">
          <div class="stat">
            <div class="left">
              <tx class="icon" />
            </div>
            <div class="right">
              <h1>Average TPS</h1>
              <h1>{{ Math.ceil(parseInt(stats.average_tps)) }} per second</h1>
            </div>
          </div>
          <div class="stat">
            <div class="left">
              <tx class="icon" />
            </div>
            <div class="right">
              <h1>Total Transactions</h1>
              <h1>{{ stats.total_transactions }}</h1>
            </div>
          </div>
          <div class="stat">
            <div class="left">
              <accounts class="icon" />
            </div>
            <div class="right">
              <h1>Total Accounts</h1>
              <h1>{{ stats.total_addresses }}</h1>
            </div>
          </div>
        </div>
        <div class="bot">
          <div class="stat">
            <div class="left">
              <next class="icon" />
            </div>
            <div class="right">
              <h1>Uptime</h1>
              <h1>{{ Math.ceil(parseInt(stats.uptime) / 60) }}min</h1>
            </div>
          </div>
          <div class="stat">
            <div class="left">
              <blocks class="icon" />
            </div>
            <div class="right">
              <h1>Next Block In</h1>
              <h1>0</h1>
            </div>
          </div>

          <div class="stat">
            <div class="left">
              <pool class="icon" />
            </div>
            <div class="right">
              <h1>Transactions In Pool</h1>
              <h1>{{ stats.pending_transactions_count }}</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="history">
        <!--         <h1 style="text-align: left; font-size: 1.5rem !important">History</h1>
 -->
        <table>
          <tr>
            <th>Block</th>
            <th>Status</th>
            <th>New Root</th>
            <th>Previous Root</th>
            <th>Transactions</th>
            <th>Time</th>
          </tr>
          <template v-for="(block, b) in blocks">
            <tr>
              <td>{{ blocks.length - b }}</td>
              <td>{{ block.status }}</td>
              <td>{{ crop(block.new_state_root) }}</td>
              <td>{{ crop(block.previous_state_root) }}</td>
              <td>{{ block.transactions.length }}</td>
              <td>{{ new Date(parseInt(block.time)).toLocaleTimeString() }}</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import next from '~icons/carbon/next-outline';
import accounts from '~icons/carbon/Events';
import tx from '~icons/carbon/DataShare';
import axios from 'axios';
import pool from '~icons/icon-park-outline/swimming-pool';
import { onMounted, ref } from 'vue';

const stats = ref();
const blocks = ref();

stats.value = {};
blocks.value = [];

onMounted(async () => {
  await getStats();
  await getBlocks();
});

const crop = (s: string) => {
  return `${s.slice(0, 8)}...${s.slice(s.length - 8, s.length)}`;
};

const getStats = async () => {
  let res = await axios.get('http://localhost:5000/query/stats');
  stats.value = res.data;
};

const getBlocks = async () => {
  let res = await axios.get('http://localhost:5000/query/blocks');
  blocks.value = res.data;
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

.stats {
  width: 100%;
  padding: 15px;
}

.top,
.bot {
  display: flex;
  flex: 1;
  margin: 15px;
}
.stat {
  flex: 1;
  margin: 30px;
  margin-bottom: 5px;
  margin-top: 5px;
  width: 25%;
  border-color: black;
  border-width: 1px;
  background-color: var(--nord4);
  height: 80px;
  font-size: 1.5rem;
  display: flex;
}

.stat .left {
  width: 20%;
  border: solid 1px black;
  height: 100%;
  line-height: 90px;
  color: white;
  background-color: var(--nord1);
}

.stat .right {
  width: 80%;
}

.icon {
  font-size: 2rem;
  line-height: 100%;
}

.history {
  padding: 15px;
  width: 100%;
  border-width: 1px;
  /*   border-color: var(--nord1);
 */
  height: 50%;
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
</style>
