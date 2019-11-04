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
    <span>&nbsp;&nbsp;</span>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import { GROUP_DELETE } from "@/store/actions.type";

export default {
  name: "RwvGroupActions",
  props: {
    group: { type: Object, required: true },
    canModify: { type: Boolean, required: true }
  },
  computed: {
    ...mapGetters(["profile", "isAuthenticated"]),
    editGroupLink() {
      return { name: "group-edit", params: { slug: this.group.slug } };
    }
  },
  methods: {
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
