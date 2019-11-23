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
        query: { parentName: session.title, parentType: 'session' }
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
        v-if="canJoin"
        variant="outline-success"
        size="sm"
        @click="joinSession"
        style="margin-right: 0.5em;"
      >
        <span>Request to Join Session</span>
      </b-button>
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
  SESSION_LEAVE
} from "@/store/actions.type";

export default {
  name: "RwvSessionActions",
  props: {
    session: { type: Object, required: true },
    canModify: { type: Boolean, required: true },
    canLeave: { type: Boolean, required: true },
    canJoin: { type: Boolean, required: true }
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
    }
  }
};
</script>
