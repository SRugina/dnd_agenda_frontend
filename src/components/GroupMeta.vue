<template>
  <div class="group-meta">
    <b-link
      :to="{ name: 'profile', params: { username: group.admin.username } }"
    >
      <img :src="group.admin.image" class="user-img" />
    </b-link>
    <div class="info">
      <b-link
        :to="{ name: 'profile', params: { username: group.admin.username } }"
        :class="mode + `-author`"
        >{{ group.admin.username }}</b-link
      >
      <span :class="mode + `-sub-info`">The Admin</span>
    </div>
    <template v-if="actions">
      <rwv-group-actions
        :group="group"
        :canModify="isCurrentUser()"
        :canLeave="isUserMember()"
        :canJoin="isUserNotWaiting"
        :invited="invited"
      ></rwv-group-actions>
    </template>
    <div style="float: right;" :class="mode + `-sub-info`">
      Members:
      <b-link
        v-for="(user, index) in group.members"
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
import RwvGroupActions from "@/components/GroupActions";
import { CHECK_GROUP_WAITING, CHECK_GROUP_INVITED } from "@/store/actions.type";

export default {
  name: "RwvGroupMeta",
  components: {
    RwvGroupActions
  },
  props: {
    group: {
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
      if (this.currentUser.username && this.group.admin.username) {
        return this.currentUser.username === this.group.admin.username;
      }
      return false;
    },
    isUserMember() {
      return this.group.members.some(user => {
        if (this.currentUser.username && user.username) {
          return this.currentUser.username === user.username;
        }
      });
    }
  },
  async created() {
    const isWaitingToJoin = await this.$store.dispatch(CHECK_GROUP_WAITING, {
      group_id: this.group.id,
      user_id: this.currentUser.id
    });
    const isInvitedToJoin = await this.$store.dispatch(CHECK_GROUP_INVITED, {
      group_id: this.group.id,
      user_id: this.currentUser.id
    });

    this.isUserNotWaiting = !(isWaitingToJoin || isInvitedToJoin);
    this.invited = isInvitedToJoin;
  }
};
</script>
