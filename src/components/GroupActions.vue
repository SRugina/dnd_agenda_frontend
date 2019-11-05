<template>
  <!-- Used when user is also admin -->
  <span v-if="canModify">
    <b-button variant="outline-secondary" size="sm" :to="editGroupLink">
      <span>&nbsp;Edit Group</span>
    </b-button>
    <span>&nbsp;&nbsp;</span>
    <b-button variant="outline-danger" size="sm" @click="deleteGroup">
      <span>&nbsp;Delete Group</span>
    </b-button>
  </span>
  <!-- Used in GroupView when not admin -->
  <span v-else>
    <b-button
      v-if="!canLeave"
      variant="outline-success"
      size="sm"
      @click="joinGroup"
    >
      <span>&nbsp;Request to Join Group</span>
    </b-button>
    <b-button v-else variant="outline-danger" size="sm" @click="leaveGroup">
      <span>&nbsp;Leave Group</span>
    </b-button>
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
    canLeave: { type: Boolean, required: true }
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
      } catch (err) {
        console.error(err);
      }
    },
    async leaveGroup() {
      try {
        await this.$store.dispatch(GROUP_LEAVE, this.group.id);
      } catch (err) {
        console.error(err);
      }
    },
    async deleteGroup() {
      try {
        await this.$store.dispatch(GROUP_DELETE, this.group.id);
        this.$router.push("/");
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
