<template>
  <div class="overview">
    <h1 class="tag" style="text-align: center !important">Send</h1>

    <!-- ! DUMMY DATA -->
    <div class="content">
      <div v-if="notSet()">No valid keypair found, generate one first</div>
      <div v-else>
        <div @click="signAndProcess()" class="button">Sign and Send</div>
        <input
          class="input-field searchbar"
          type="text"
          placeholder="Amount"
          name="usrnm"
          v-model="amount"
        />
        <input
          class="input-field searchbar"
          type="text"
          placeholder="Nonce"
          name="usrnm"
          v-model="nonce"
        />
        <input
          class="input-field searchbar"
          type="text"
          placeholder="Receiver"
          name="usrnm"
          v-model="receiver"
        />
        {{ nonce }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { base58Decode, base58Encode } from '../../../lib/baseEncoding';
import { ref } from 'vue';

import { createAndSignPayment } from '../../../client_sdk/lib/transaction';
import RollupTransaction from '../../../rollup_operator/rollup/models/RollupTransaction';
import { isReady, PrivateKey, PublicKey, UInt32, UInt64 } from 'snarkyjs';

const amount = ref();
const nonce = ref();
const receiver = ref();

const signAndProcess = async () => {
  await isReady;
  let acc = JSON.parse(localStorage.getItem('account')!);

  let senderPub = PublicKey.fromJSON(acc.publicKey_enc);
  let senderPriv = PrivateKey.fromJSON(acc.privateKey);
  let receiverPub = PublicKey.fromJSON(
    JSON.parse(base58Decode(receiver.value))
  );
  console.log(receiverPub);
  let rollupTransaction = new RollupTransaction(
    UInt64.fromNumber(parseInt(amount.value)),
    UInt32.fromNumber(parseInt(nonce.value)),
    senderPub!,
    receiverPub!
  );

  let payload = createAndSignPayment(
    rollupTransaction,
    base58Encode(JSON.stringify(senderPub?.toJSON())),
    receiver.value,
    senderPriv!
  );

  let res = axios.post('http://localhost:5000/rollup/transaction', payload);
  console.log(res);
};

const notSet = () => {
  return localStorage.getItem('account') == null;
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
