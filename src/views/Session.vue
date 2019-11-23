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
        <b-col md="8">
          <div v-html="parseMarkdown(session.description)"></div>
        </b-col>
        <b-col md="4">
          <div v-if="session.members.length === 0" class="profile-preview">
            No members are here... yet.
          </div>
          <b-jumbotron id="members" bg-variant="white" lead="Members:">
            <RwvProfilePreview
              v-for="(profile, index) in session.members"
              :profile="profile"
              :key="profile.username + index"
              :noBio="true"
              :actions="isCurrentUser()"
              actionsType="session"
              :parentId="session.id"
            />
          </b-jumbotron>
        </b-col>
      </b-row>
      <hr />
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import marked from "marked";
import { sanitize } from "dompurify";
import store from "@/store";
import RwvSessionMeta from "@/components/SessionMeta";
import RwvProfilePreview from "@/components/VProfilePreview";
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
    RwvSessionMeta,
    RwvProfilePreview
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
    },
    isCurrentUser() {
      if (this.currentUser.username && this.session.dm.username) {
        return this.currentUser.username === this.session.dm.username;
      }
      return false;
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

#members {
  padding: 2rem 2rem !important;
}
</style>
