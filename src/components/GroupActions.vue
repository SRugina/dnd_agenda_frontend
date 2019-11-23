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
        query: { parentName: group.name, parentType: 'group' }
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
        v-if="canJoin"
        variant="outline-success"
        size="sm"
        @click="joinGroup"
        style="margin-right: 0.5em;"
      >
        <span>Request to Join Group</span>
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
import { GROUP_DELETE, GROUP_JOIN, GROUP_LEAVE } from "@/store/actions.type";

export default {
  name: "RwvGroupActions",
  props: {
    group: { type: Object, required: true },
    canModify: { type: Boolean, required: true },
    canLeave: { type: Boolean, required: true },
    canJoin: { type: Boolean, required: true }
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
    }
  }
};
</script>
