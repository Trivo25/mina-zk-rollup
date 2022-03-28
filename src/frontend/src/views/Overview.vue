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
              <h1>Total Transactions</h1>
              <h1>0</h1>
            </div>
          </div>
          <div class="stat">
            <div class="left">
              <blocks class="icon" />
            </div>
            <div class="right">
              <h1>Total Blocks</h1>
              <h1>0</h1>
            </div>
          </div>
          <div class="stat">
            <div class="left">
              <accounts class="icon" />
            </div>
            <div class="right">
              <h1>Total Accounts</h1>
              <h1>0</h1>
            </div>
          </div>
        </div>
        <div class="bot">
          <div class="stat">
            <div class="left">
              <blocks class="icon" />
            </div>
            <div class="right">
              <h1>Last Block Submitted</h1>
              <h1>0</h1>
            </div>
          </div>
          <div class="stat">
            <div class="left">
              <next class="icon" />
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
              <h1>0</h1>
            </div>
          </div>
        </div>
      </div>

      <div class="history">dasd</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import blocks from '~icons/clarity/blocks-group-line';
import next from '~icons/carbon/next-outline';
import accounts from '~icons/carbon/Events';
import tx from '~icons/carbon/DataShare';

import pool from '~icons/icon-park-outline/swimming-pool';
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
  display: flex;
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
</style>
