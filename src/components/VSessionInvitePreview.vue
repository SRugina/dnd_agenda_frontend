<template>
  <div class="session-invite-preview">
    <div style="float: left;">
      <RwvProfileMeta
        isPreview
        :profile="sessionInvite.profile"
        mode="dark"
        style="float: left;"
      />
      <b-link :to="sessionLink" class="preview-link" style="float: left;">
        <p v-text="'to ' + sessionInvite.title" />
      </b-link>
    </div>
    <div class="session-invite-actions" style="float: right;">
      <b-button
        variant="outline-success"
        size="sm"
        @click="acceptToJoinSession"
        style="margin-right: 0.5em;"
      >
        <span>Accept</span>
      </b-button>
      <b-button variant="outline-danger" size="sm" @click="denyToJoinSession">
        <span>Deny</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import RwvProfileMeta from "./ProfileMeta";
import {
  ACCEPT_TO_JOIN_SESSION,
  DENY_TO_JOIN_SESSION
} from "@/store/actions.type";

export default {
  name: "RwvSessionInvitePreview",
  components: {
    RwvProfileMeta
  },
  props: {
    sessionInvite: { type: Object, required: true }
  },
  computed: {
    sessionLink() {
      return {
        name: "session",
        params: {
          slug: this.sessionInvite.slug
        }
      };
    }
  },
  methods: {
    async acceptToJoinSession() {
      try {
        await this.$store.dispatch(
          ACCEPT_TO_JOIN_SESSION,
          this.sessionInvite.id
        );
        this.$router.push({ path: `/sessions/${this.sessionInvite.slug}` });
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async denyToJoinSession() {
      try {
        await this.$store.dispatch(DENY_TO_JOIN_SESSION, this.sessionInvite.id);
        this.$router.go();
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
.session-invite-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
}
.preview-link {
  color: inherit !important;
}
</style>
