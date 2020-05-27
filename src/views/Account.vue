<template>
  <div>
    <div class="container">
      <div class="wrapper">
        <div class="h1">Your account mnemonic</div>
        <div class="box">
          <code>{{ account.mnemonic }}</code>
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
.box {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
}
</style>

<script>
export default {
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
};
</script>
