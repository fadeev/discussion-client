<template>
  <div>
    <div class="container">
      <div class="sidebar">
        <app-sidebar v-bind="{ channels }" />
      </div>
      <div class="main">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  --sidebar-width: 260px;
}
.sidebar {
  background-color: #f8f8fa;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  box-shadow: inset -1px 0 0 0 rgba(0, 0, 0, 0.05);
}
.main {
  margin-left: var(--sidebar-width);
}
</style>

<script>
import AppSidebar from "@/components/AppSidebar";

export default {
  components: {
    AppSidebar,
  },
  computed: {
    channels() {
      return this.$store.state.channels;
    },
  },
};
</script>
