<template>
  <div class="overview">
    <h1 class="tag" style="text-align: center !important">Account</h1>

    <!-- ! DUMMY DATA -->
    <div class="content">
      <div @click="requestAccount()" class="button">Request Demo Account</div>
      <br /><br />
      <div v-if="account" style="width: 100% !important; position: absolute">
        <h3 style="color: red">
          Your private and public key will be stored in your browsers storage
          and used automatically to sign transactions
        </h3>
        <br />
        PublicKey: {{ crop(account.pub_enc) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import refresh from '~icons/el/refresh';
import axios from 'axios';
import { base58Decode } from '../../../lib/baseEncoding';
import { ref, onMounted } from 'vue';

const account = ref();

const requestAccount = async () => {
  let res = await axios.post('https://api.technotro.com/rollup/createAccount');
  account.value = res.data;
  let pair = {
    privateKey: account.value.priv,
    publicKey_enc: JSON.parse(base58Decode(account.value.pub_enc)),
  };
  localStorage.account = JSON.stringify(pair);
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

.button {
  position: relative;
  margin-top: 50px;
  left: calc(50% - 100px);
  width: 220px;
  border: solid 1px black;
  background-color: var(--nord4);
  height: 60px;
  line-height: 60px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.5s;
}
.button:hover {
  background-color: var(--nord2);
  color: white;
  transform: scale(1.02);
}
</style>
