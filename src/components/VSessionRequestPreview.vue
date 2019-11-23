<template>
  <div class="session-request-preview">
    <div style="float: left;">
      <RwvProfileMeta
        isPreview
        :profile="sessionRequest.profile"
        mode="dark"
        style="float: left;"
      />
      <b-link :to="sessionLink" class="preview-link" style="float: left;">
        <p v-text="'to ' + sessionRequest.title" />
      </b-link>
    </div>
    <div class="session-request-actions" style="float: right;">
      <b-button
        variant="outline-success"
        size="sm"
        @click="acceptToSession"
        style="margin-right: 0.5em;"
      >
        <span>Accept</span>
      </b-button>
      <b-button variant="outline-danger" size="sm" @click="denyToSession">
        <span>Deny</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import RwvProfileMeta from "./ProfileMeta";
import { ACCEPT_TO_SESSION, DENY_TO_SESSION } from "@/store/actions.type";

export default {
  name: "RwvSessionRequestPreview",
  components: {
    RwvProfileMeta
  },
  props: {
    sessionRequest: { type: Object, required: true }
  },
  computed: {
    sessionLink() {
      return {
        name: "session",
        params: {
          slug: this.sessionRequest.slug
        }
      };
    }
  },
  methods: {
    async acceptToSession() {
      try {
        await this.$store.dispatch(ACCEPT_TO_SESSION, {
          session_id: this.sessionRequest.id,
          user_id: this.sessionRequest.profile.id
        });
        this.$router.push({ path: `/sessions/${this.sessionRequest.slug}` });
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async denyToSession() {
      try {
        await this.$store.dispatch(DENY_TO_SESSION, {
          session_id: this.sessionRequest.id,
          user_id: this.sessionRequest.profile.id
        });
        this.$router.push({ name: "home" });
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.session-request-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
}
.preview-link {
  color: inherit !important;
}
</style>
