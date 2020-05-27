<template>
  <div>
    <div>{{ posts }}</div>
    <div class="create__container">
      <div class="create">
        <input
          type="text"
          class="create__input"
          :placeholder="`Message ${channel.name}`"
          v-model="post"
          @keypress.enter="submit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.create__container {
  position: fixed;
  bottom: 0;
  width: 100%;
  right: 0;
  left: 260px;
  box-sizing: border-box;
  z-index: 3000;
  padding: 0.75rem 1rem;
}
.create {
  background: white;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  width: calc(100% - 260px);
  position: relative;
  border-radius: 0.25rem;
}
.create__input {
  background: rgba(0, 0, 0, 0);
  border: none;
  padding: 0;
  outline: none;
  font-size: initial;
  width: 100%;
  font-family: inherit;
  box-sizing: border-box;
  padding: 0rem 1rem;
  line-height: 2.75rem;
  font-size: 0.875rem;
}
</style>

<script>
import store from "@/store/index";

export default {
  props: {
    id: String,
  },
  data() {
    return {
      post: "",
    };
  },
  methods: {
    submit() {
      store.dispatch("postSend", { body: this.post, channel_id: this.id });
    },
  },
  computed: {
    channel() {
      let channel = {};
      store.state.channels.forEach((c) => {
        if (c.id === this.id) {
          channel = c;
        }
      });
      return channel;
    },
    posts() {
      return store.state.posts[this.id];
    },
  },
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      await store.dispatch("postsFetch", to.params.id);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await store.dispatch("postsFetch", to.params.id);
    next();
  },
};
</script>
