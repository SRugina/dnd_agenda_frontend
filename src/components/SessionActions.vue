<template>
  <!-- Used when user is also dm -->
  <span v-if="canModify">
    <b-button
      variant="outline-secondary"
      size="sm"
      :to="editSessionLink"
      style="margin-right: 0.5em;"
    >
      <span>Edit Session</span>
    </b-button>
    <span>&nbsp;</span>
    <b-button variant="outline-danger" size="sm" @click="deleteSession">
      <span>Delete Session</span>
    </b-button>
    <span>&nbsp;</span>
    <b-button
      variant="outline-success"
      size="sm"
      :to="{
        name: 'invite',
        query: {
          parentName: session.title,
          parentType: 'session',
          parentId: session.id
        }
      }"
      >&nbsp;Invite</b-button
    >
  </span>
  <!-- Used in SessionView when not dm -->
  <span v-else>
    <b-button
      v-if="canLeave"
      variant="outline-danger"
      size="sm"
      @click="leaveSession"
    >
      <span>Leave Session</span>
    </b-button>
    <div v-else>
      <b-button
        v-if="canJoin && !invited"
        variant="outline-success"
        size="sm"
        @click="joinSession"
        style="margin-right: 0.5em;"
      >
        <span>Request to Join Session</span>
      </b-button>
      <div v-else-if="invited">
        <b-button
          variant="outline-success"
          size="sm"
          @click="acceptInviteToJoinGroup"
          style="margin-right: 0.5em;"
        >
          <span>You've been invited! Click here to accept</span>
        </b-button>
        <b-button
          variant="outline-danger"
          size="sm"
          @click="denyInviteToJoinGroup"
          style="margin-right: 0.5em;"
        >
          <span>Or click here to deny invite</span>
        </b-button>
      </div>
      <b-button
        v-else
        variant="outline-secondary"
        size="sm"
        style="margin-right: 0.5em;"
        disabled
      >
        <span>Request Pending Acceptance</span>
      </b-button>
    </div>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import {
  SESSION_DELETE,
  SESSION_JOIN,
  SESSION_LEAVE,
  ACCEPT_TO_JOIN_SESSION,
  DENY_TO_JOIN_SESSION
} from "@/store/actions.type";

export default {
  name: "RwvSessionActions",
  props: {
    session: { type: Object, required: true },
    canModify: { type: Boolean, required: true },
    canLeave: { type: Boolean, required: true },
    canJoin: { type: Boolean, required: true },
    invited: { type: Boolean, required: true }
  },
  computed: {
    ...mapGetters(["profile", "isAuthenticated"]),
    editSessionLink() {
      return { name: "session-edit", params: { slug: this.session.slug } };
    }
  },
  methods: {
    async joinSession() {
      try {
        await this.$store.dispatch(SESSION_JOIN, this.session.id);
        this.canJoin = false;
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async leaveSession() {
      try {
        await this.$store.dispatch(SESSION_LEAVE, this.session.id);
        this.$router.push("/");
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async deleteSession() {
      try {
        await this.$store.dispatch(SESSION_DELETE, this.session.id);
        this.$router.push("/");
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async acceptToJoinSession() {
      try {
        await this.$store.dispatch(ACCEPT_TO_JOIN_SESSION, this.session.id);
        this.$router.push({ path: `/sessions/${this.session.slug}` });
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
        await this.$store.dispatch(DENY_TO_JOIN_SESSION, this.session.id);
        this.canJoin = true;
        this.invited = false;
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
