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
        <tr>
          <td>1</td>
          <td>Transfer</td>
          <td>100db386818cee4ff0f2972431a62ed78ed8</td>
          <td>e6bbf33a230c16443a20447bc3a7616d813a</td>
          <td>32.00 MINA</td>
          <td>0.01 MINA</td>
          <td>05:14:32 UTC, 28-03-2022</td>
        </tr>
      </table>
      <div class="refresh">
        <refresh style="font-size: 4rem; padding: 5px" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import refresh from '~icons/el/refresh';
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
