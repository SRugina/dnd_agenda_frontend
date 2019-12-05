<template>
  <div class="session-meta">
    <b-link
      :to="{ name: 'profile', params: { username: session.dm.username } }"
    >
      <img :src="session.dm.image" class="user-img" />
    </b-link>
    <div class="info">
      <b-link
        :to="{ name: 'profile', params: { username: session.dm.username } }"
        :class="mode + `-author`"
        >{{ session.dm.username }}</b-link
      >
      <span :class="mode + `-sub-info`">The DM</span>
      <span :class="mode + `-sub-info`" style="font-weight: 400;">{{
        (session.date || session.sessionDate) | date
      }}</span>
    </div>
    <template v-if="actions">
      <rwv-session-actions
        :session="session"
        :canModify="isCurrentUser()"
        :canLeave="isUserMember()"
        :canJoin="isUserNotWaiting"
        :invited="invited"
      ></rwv-session-actions>
    </template>
    <div style="float: right;" :class="mode + `-sub-info`">
      Members:
      <b-link
        v-for="(user, index) in session.members"
        :to="{ name: 'profile', params: { username: user.username } }"
        :key="user.username + index"
      >
        <img :src="user.image" class="user-img" />
      </b-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvSessionActions from "@/components/SessionActions";
import {
  CHECK_SESSION_WAITING,
  CHECK_SESSION_INVITED
} from "@/store/actions.type";

export default {
  name: "RwvSessionMeta",
  components: {
    RwvSessionActions
  },
  props: {
    session: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    actions: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isUserNotWaiting: false,
      invited: false
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser.username && this.session.dm.username) {
        return this.currentUser.username === this.session.dm.username;
      }
      return false;
    },
    isUserMember() {
      return this.session.members.some(user => {
        if (this.currentUser.username && user.username) {
          return this.currentUser.username === user.username;
        }
      });
    }
  },
  async created() {
    const isWaitingToJoin = await this.$store.dispatch(CHECK_SESSION_WAITING, {
      session_id: this.session.id,
      user_id: this.currentUser.id
    });

    const isInvitedToJoin = await this.$store.dispatch(CHECK_SESSION_INVITED, {
      session_id: this.session.id,
      user_id: this.currentUser.id
    });

    this.isUserNotWaiting = !(isWaitingToJoin || isInvitedToJoin);
    this.invited = isInvitedToJoin;
  }
};
</script>
