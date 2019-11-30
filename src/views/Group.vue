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
        <b-col md="8">
          <div v-html="parseMarkdown(group.description)"></div>
        </b-col>
        <b-col md="4">
          <div v-if="group.members.length === 0" class="profile-preview">
            No members are here... yet.
          </div>
          <b-jumbotron id="members" bg-variant="white" lead="Members:">
            <RwvProfilePreview
              v-for="(profile, index) in group.members"
              :profile="profile"
              :key="profile.username + index"
              :noBio="true"
              :actions="isCurrentUser()"
              actionsType="group"
              :parentId="group.id"
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
import RwvGroupMeta from "@/components/GroupMeta";
import RwvProfilePreview from "@/components/VProfilePreview";
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
    RwvGroupMeta,
    RwvProfilePreview
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
    },
    isCurrentUser() {
      if (this.currentUser.username && this.group.admin.username) {
        return this.currentUser.username === this.group.admin.username;
      }
      return false;
    }
  }
};
</script>
