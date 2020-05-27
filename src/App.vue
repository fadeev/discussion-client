<template>
  <div>
    <app-layout>
      <router-view :key="$route.fullPath" />
    </app-layout>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: "Inter", Helvetica, Arial, sans-serif;
}
code {
  font-family: "Fira Code", monospace;
}
</style>

<script>
import AppLayout from "@/components/AppLayout";

export default {
  components: {
    AppLayout,
  },
  created() {
    this.$store.dispatch("walletCreate");
    this.$store.dispatch("channelsFetch");
  },
};
</script>
