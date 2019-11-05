<template>
  <div class="session-page">
    <div class="banner">
      <b-container>
        <h1>{{ session.title }}</h1>
        <RwvSessionMeta
          :session="session"
          :actions="true"
          mode="light"
        ></RwvSessionMeta>
      </b-container>
    </div>
    <b-container>
      <b-row class="session-content">
        <b-col cols="12" class="col-xs-12">
          <div v-html="parseMarkdown(session.description)"></div>
        </b-col>
      </b-row>
      <hr />
      <div class="session-actions">
        <RwvSessionMeta
          :session="session"
          :actions="true"
          mode="dark"
        ></RwvSessionMeta>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import { sanitize } from "dompurify";
import store from "@/store";
import RwvSessionMeta from "@/components/SessionMeta";
import { FETCH_SESSION } from "@/store/actions.type";

export default {
  name: "rwv-session",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  components: {
    RwvSessionMeta
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([store.dispatch(FETCH_SESSION, to.params.slug)]).then(() => {
      next();
    });
  },
  computed: {
    ...mapGetters(["session", "currentUser", "isAuthenticated"])
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

.session-actions {
  text-align: center;
  margin: 1.5rem 0 3rem;
}
</style>
