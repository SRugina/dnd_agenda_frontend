<template>
  <div class="session-preview">
    <RwvSessionMeta isPreview :session="session" mode="dark" />
    <b-link :to="sessionLink" class="preview-link">
      <h2 v-text="session.title" />
      <span>Find out more...</span>
    </b-link>
  </div>
</template>

<script>
import RwvSessionMeta from "./SessionMeta";

export default {
  name: "RwvSessionPreview",
  components: {
    RwvSessionMeta
  },
  props: {
    session: { type: Object, required: true }
  },
  computed: {
    sessionLink() {
      return {
        name: "session",
        params: {
          slug: this.session.slug
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.session-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
}
.preview-link {
  color: inherit !important;
}
</style>
