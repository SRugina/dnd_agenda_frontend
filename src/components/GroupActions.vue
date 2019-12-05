<template>
  <!-- Used when user is also admin -->
  <span v-if="canModify">
    <b-button
      variant="outline-secondary"
      size="sm"
      :to="editGroupLink"
      style="margin-right: 0.5em;"
    >
      <span>Edit Group</span>
    </b-button>
    <span>&nbsp;</span>
    <b-button variant="outline-danger" size="sm" @click="deleteGroup">
      <span>Delete Group</span>
    </b-button>
    <span>&nbsp;</span>
    <b-button
      variant="outline-success"
      size="sm"
      :to="{
        name: 'invite',
        query: {
          parentName: group.name,
          parentType: 'group',
          parentId: group.id
        }
      }"
      >Invite</b-button
    >
  </span>
  <!-- Used in GroupView when not admin -->
  <span v-else style="display: inline-block;">
    <b-button
      v-if="canLeave"
      variant="outline-danger"
      size="sm"
      @click="leaveGroup"
    >
      <span>Leave Group</span>
    </b-button>
    <div v-else>
      <b-button
        v-if="canJoin && !invited"
        variant="outline-success"
        size="sm"
        @click="joinGroup"
        style="margin-right: 0.5em;"
      >
        <span>Request to Join Group</span>
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
  GROUP_DELETE,
  GROUP_JOIN,
  GROUP_LEAVE,
  ACCEPT_TO_JOIN_GROUP,
  DENY_TO_JOIN_GROUP
} from "@/store/actions.type";

export default {
  name: "RwvGroupActions",
  props: {
    group: { type: Object, required: true },
    canModify: { type: Boolean, required: true },
    canLeave: { type: Boolean, required: true },
    canJoin: { type: Boolean, required: true },
    invited: { type: Boolean, required: true }
  },
  computed: {
    ...mapGetters(["profile", "isAuthenticated"]),
    editGroupLink() {
      return { name: "group-edit", params: { slug: this.group.slug } };
    }
  },
  methods: {
    async joinGroup() {
      try {
        await this.$store.dispatch(GROUP_JOIN, this.group.id);
        this.canJoin = false;
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async leaveGroup() {
      try {
        await this.$store.dispatch(GROUP_LEAVE, this.group.id);
        this.$router.push("/");
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async deleteGroup() {
      try {
        await this.$store.dispatch(GROUP_DELETE, this.group.id);
        this.$router.push("/");
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async acceptToJoinGroup() {
      try {
        await this.$store.dispatch(ACCEPT_TO_JOIN_GROUP, this.group.id);
        this.$router.push({ path: `/groups/${this.group.slug}` });
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async denyToJoinGroup() {
      try {
        await this.$store.dispatch(DENY_TO_JOIN_GROUP, this.group.id);
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
