import Vue from "vue";
import Vuex from "vuex";
import * as bip39 from "bip39";
import {
  createWalletFromMnemonic,
  createAddress,
  createSignMsg,
  verifySignature,
  sign,
  sha256,
} from "@tendermint/sig";
import axios from "axios";
import { signTx, createBroadcastTx, createSignature } from "@tendermint/sig";
import {
  base64ToBytes,
  bytesToBase64,
  toCanonicalJSONBytes,
  toCanonicalJSONClone,
  bytesToString,
} from "@tendermint/belt";
import {
  publicKeyCreate,
  sign as secp256k1Sign,
  verify as secp256k1Verify,
} from "secp256k1";

Vue.use(Vuex);

const RPC = "http://localhost:26657";
const LCD = "http://localhost:8080";
const chainID = "dither";

export default new Vuex.Store({
  state: {
    account: {},
    channels: [],
    posts: {},
    genesis: {},
    out: null,
  },
  mutations: {
    walletCreate(state, { wallet }) {
      state.account = { ...state.account, ...wallet };
      window.localStorage.setItem("mnemonic", wallet.mnemonic);
    },
    channelsCreate(state, channels) {
      state.channels = [...state.channels, ...channels];
    },
    postsCreate(state, { posts, channelID }) {
      let postsAdded = {};
      postsAdded[channelID] = posts;
      state.posts = { ...state.posts, ...postsAdded };
    },
    outSet(state, out) {
      state.out = out;
    },
  },
  actions: {
    walletCreate({ commit }) {
      const savedMnemonic = window.localStorage.getItem("mnemonic");
      const mnemonic = savedMnemonic || bip39.generateMnemonic();
      const wallet = createWalletFromMnemonic(mnemonic);
      commit("walletCreate", { wallet: { mnemonic, ...wallet } });
    },
    async channelsFetch({ commit }) {
      const url = `${RPC}/abci_query?path=%22/custom/dither/list-channels/%22`;
      const base64 = (await axios.get(url)).data.result.response.value;
      const channels = JSON.parse(atob(base64));
      commit("channelsCreate", channels || []);
    },
    postsFetch({ commit }, channelID) {
      return new Promise(async (resolve, reject) => {
        const url = `${RPC}/abci_query?path=%22/custom/dither/list-posts/${channelID}%22`;
        const base64 = (await axios.get(url)).data.result.response.value;
        const posts = JSON.parse(atob(base64)) || [];
        this.commit("postsCreate", { channelID, posts });
        resolve(posts);
      });
    },
    async postSend({ state, commit }, { channel_id, body }) {
      const accountsURL = `${LCD}/auth/accounts/${state.account.address}`;
      const account = (await axios.get(accountsURL)).data.result.value;
      const { sequence, account_number } = account;
      const chain_id = "dither";
      const publicKey = state.account.publicKey;
      const privateKey = state.account.privateKey;
      const req = {
        base_req: {
          chain_id,
          from: createAddress(publicKey),
        },
        creator: createAddress(publicKey),
        name: body,
      };
      let tx = (await axios.post(`${LCD}/dither/channels`, req)).data.value;
      tx.signatures = [];
      console.log(tx);
      const meta = { account_number, chain_id, sequence };
      const keypair = { publicKey, privateKey };
      const stdTx = signTx(tx, meta, keypair);
      const txBroadcast = createBroadcastTx(stdTx);
      axios.post(`${LCD}/txs`, txBroadcast, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      commit("outSet", stdTx);
      // const signature = createSignature({ ...tx.value, ...meta }, keypair);
      // // tx.value.msg[0].value.likes = [
      // //   "cosmos18cd5t4msvp2lpuvh99rwglrmjrrw9qx5h3f3gz",
      // // ];
      // // tx.value.signatures = [];
      // console.log(signature);
      // const signMsg = {
      //   fee: tx.value.fee,
      //   memo: tx.value.memo,
      //   msg: tx.value.msg,
      //   ...meta,
      // };
      // console.log(signMsg);
      // signMsg.fee.amount.push({ amount: "1", denom: "foo" });
      // signMsg.memo = "123";
      // console.log(signMsg);
      // console.log(toCanonicalJSONClone(signMsg));
      // console.log(
      //   bytesToBase64(
      //     sign(sha256(toCanonicalJSONBytes(signMsg)), keypair.privateKey)
      //   )
      // );
      // console.log(tx.value, meta);
      // console.log(signature);
      // tx = {
      //   ...tx,
      //   account_number: account_number,
      //   chain_id,
      //   sequence: sequence,
      // };
      // console.log(tx);
      // console.log("tx", tx);
      // const StdSignMsg = createSignMsg(tx.value, meta);
      // const StdSignature = createSignature(StdSignMsg, keypair);
      // console.log(verifySignature(StdSignMsg, StdSignature));
      // console.log(tx);
      // const signature = createSignature(tx, keypair);
      // console.log(signature);
      // console.log(stdTx);
      // commit("outSet", signMsg);
      // console.log(tx);
      // state.res = tx;
      // commit("resSet", txBroadcast);
      // console.log("tx", tx);
      // console.log("stdTx", stdTx);
      // console.log("txBroadcast", txBroadcast);
      // console.log(txBroadcast);
      // const txTest = {
      //   type: "cosmos-sdk/StdTx",
      //   value: {
      //     msg: [
      //       {
      //         type: "dither/CreatePost",
      //         value: {
      //           creator: "cosmos18cd5t4msvp2lpuvh99rwglrmjrrw9qx5h3f3gz",
      //           body: "asd",
      //           likes: null,
      //           channel_id: "5c124f63-4116-4aed-996b-b4519a339480",
      //         },
      //       },
      //     ],
      //     fee: { amount: [], gas: "200000" },
      //     signatures: [
      //       {
      //         pub_key: {
      //           type: "tendermint/PubKeySecp256k1",
      //           value: "A5lfll1RiMbiBRmCkuP5PjehJez6Lymko3/nohbZCYGs",
      //         },
      //         signature:
      //           "iXmpXDPr0TyWNmzGD9ziZD3batIaQrfqpISU0XU1gi0XcUFzEX30Es+Im3q6gW1XD25glDs1Kl18IDHcGxVMdQ==",
      //       },
      //     ],
      //     memo: "",
      //   },
      // };
      // const txBroadcastTest = createBroadcastTx(txTest);
      // axios.post(`${LCD}/txs`, txBroadcastTest, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // console.log(new TextDecoder("utf-8").decode(state.account.publicKey));
      // console.log(tx, stdTx, txBroadcast);
      // const account = (await axios.get(accountsURL)).data.result.value;
      // const tx = {
      //   fee: "200",
      //   memo: "",
      //   msg: [
      //     {
      //       type: "dither/CreatePost",
      //       value: {
      //         creator: state.account.publicKey,
      //       },
      //     },
      //   ],
      // };
      // let stdTx = signTx(tx, meta, keypair);
      // const txBroadcast = createBroadcastTx(stdTx);
      // txBroadcast.return = "async";
      // axios.post(`${LCD}/txs`, txBroadcast, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // console.log(broadcastTx);
    },
  },
});
