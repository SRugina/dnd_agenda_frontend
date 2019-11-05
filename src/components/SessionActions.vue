<template>
  <!-- Used when user is also dm -->
  <span v-if="!canModify">
    <b-button variant="outline-secondary" size="sm" :to="editSessionLink">
      <span>&nbsp;Edit Session</span>
    </b-button>
    <span>&nbsp;&nbsp;</span>
    <b-button variant="outline-danger" size="sm" @click="deleteSession">
      <span>&nbsp;Delete Session</span>
    </b-button>
  </span>
  <!-- Used in SessionView when not dm -->
  <span v-else>
    <b-button
      v-if="!canLeave"
      variant="outline-success"
      size="sm"
      @click="joinSession"
    >
      <span>&nbsp;Request to Join Session</span>
    </b-button>
    <b-button v-else variant="outline-danger" size="sm" @click="leaveSession">
      <span>&nbsp;Leave Session</span>
    </b-button>
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
    canLeave: { type: Boolean, required: true }
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
      } catch (err) {
        console.error(err);
      }
    },
    async leaveSession() {
      try {
        await this.$store.dispatch(SESSION_LEAVE, this.session.id);
      } catch (err) {
        console.error(err);
      }
    },
    async deleteSession() {
      try {
        await this.$store.dispatch(SESSION_DELETE, this.session.id);
        this.$router.push("/");
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
