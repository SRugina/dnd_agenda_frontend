<template>
  <div class="group-preview">
    <RwvGroupMeta isPreview :group="group" mode="dark" />
    <b-link :to="groupLink" class="preview-link">
      <h2 v-text="group.name" />
      <span>Find out more...</span>
    </b-link>
  </div>
</template>

<script>
import RwvGroupMeta from "./GroupMeta";

export default {
  name: "RwvGroupPreview",
  components: {
    RwvGroupMeta
  },
  props: {
    group: { type: Object, required: true }
  },
  computed: {
    groupLink() {
      return {
        name: "group",
        params: {
          slug: this.group.slug
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.group-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
}
.preview-link {
  color: inherit !important;
}
</style>
