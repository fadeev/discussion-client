<template>
  <div>
    <div class="container">
      <div class="wrapper">
        <div class="h1">Log in with your account</div>
        <div class="selector">
          <span class="button">
            I already have a mnemonic
          </span>
          or
          <span class="button" @click="accountCreate">
            create a new account for me
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  color: rgba(0, 0, 0, 0.75);
  padding: 2rem;
  box-sizing: border-box;
}
.wrapper {
  padding-top: 30vh;
  width: 100%;
  max-width: 600px;
}
.h1 {
  font-size: 1.5rem;
  font-weight: 300;
  text-align: center;
  margin-bottom: 2rem;
}
.selector {
  text-align: center;
  color: rgba(0, 0, 0, 0.35);
  line-height: 1.5;
}
.button {
  padding-bottom: 0.25rem;
  box-shadow: inset 0 -0.5px 0 rgba(0, 0, 0, 0.25);
  color: rgba(0, 0, 0, 0.75);
  cursor: pointer;
  user-select: none;
  transition: all 0.1s;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
.button:hover {
  color: black;
}
.button:active {
  opacity: 0.65;
}
</style>

<script>
export default {
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  methods: {
    accountCreate() {
      this.$store.dispatch("walletCreate");
    },
  },
};
</script>
