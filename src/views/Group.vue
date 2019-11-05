<template>
  <div class="group-page">
    <div class="banner">
      <b-container>
        <h1>{{ group.name }}</h1>
        <RwvGroupMeta
          :group="group"
          :actions="true"
          mode="light"
        ></RwvGroupMeta>
      </b-container>
    </div>
    <b-container>
      <b-row class="group-content">
        <b-col cols="12">
          <div v-html="parseMarkdown(group.description)"></div>
        </b-col>
      </b-row>
      <hr />
      <div class="group-actions">
        <RwvGroupMeta :group="group" :actions="true" mode="dark"></RwvGroupMeta>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import { sanitize } from "dompurify";
import store from "@/store";
import RwvGroupMeta from "@/components/GroupMeta";
import { FETCH_GROUP } from "@/store/actions.type";

export default {
  name: "rwv-group",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  components: {
    RwvGroupMeta
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([store.dispatch(FETCH_GROUP, to.params.slug)]).then(() => {
      next();
    });
  },
  computed: {
    ...mapGetters(["group", "currentUser", "isAuthenticated"])
  },
  methods: {
    parseMarkdown(content) {
      return sanitize(marked(content));
    }
  }
};
</script>

<style lang="scss" scoped>
.banner {
  padding: 2rem 0;
  color: #fff;
  background: #333;
  padding: 2rem;
  margin-bottom: 2rem;
}

.group-actions {
  text-align: center;
  margin: 1.5rem 0 3rem;
}
</style>
