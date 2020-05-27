<template>
  <div class="sidebar__container">
    <div class="list">
      <router-link
        class="list__item"
        tag="div"
        v-for="channel in channels"
        :key="channel.id"
        :to="`/channel/${channel.id}`"
      >
        # {{ channel.name }}
      </router-link>
    </div>
    <div class="footer">
      <router-link to="/account" tag="div" class="signup">
        Account
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.sidebar__container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  z-index: 5000;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 260px;
  padding: 0.75rem;
  box-sizing: border-box;
}
.signup {
  background: white;
  padding: 0.75rem;
  text-align: center;
  border-radius: 0.25rem;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  user-select: none;
  cursor: pointer;
  transition: all 0.1s;
  color: rgba(0, 0, 0, 0.75);
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.signup:active {
  opacity: 0.75;
  transform: translateY(1px);
}
.list {
  padding-top: 1rem;
}
.list__item {
  line-height: 2;
  font-size: 0.875rem;
  padding: 0 1rem;
  color: rgba(0, 0, 0, 0.75);
  user-select: none;
  cursor: pointer;
}
.list__item.router-link-active {
  background: #2f9ee0;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: inset -1px 0 0 0 rgba(0, 0, 0, 0.05);
}
</style>

<script>
export default {
  props: {
    channels: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
