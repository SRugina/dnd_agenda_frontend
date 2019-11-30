<template>
  <div class="object-preview">
    <div style="float: left;">
      <RwvProfileMeta
        isPreview
        :profile="groupInvite.profile"
        mode="dark"
        style="float: left;"
      />
      <b-link :to="groupLink" class="preview-link" style="float: left;">
        <p v-text="'to ' + groupInvite.name" />
      </b-link>
    </div>
    <div class="actions" style="float: right;">
      <b-button
        variant="outline-success"
        size="sm"
        @click="acceptToJoinGroup"
        style="margin-right: 0.5em;"
      >
        <span>Accept</span>
      </b-button>
      <b-button variant="outline-danger" size="sm" @click="denyToJoinGroup">
        <span>Deny</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import RwvProfileMeta from "./ProfileMeta";
import { ACCEPT_TO_JOIN_GROUP, DENY_TO_JOIN_GROUP } from "@/store/actions.type";

export default {
  name: "RwvGroupInvitePreview",
  components: {
    RwvProfileMeta
  },
  props: {
    groupInvite: { type: Object, required: true }
  },
  computed: {
    groupLink() {
      return {
        name: "group",
        params: {
          slug: this.groupInvite.slug
        }
      };
    }
  },
  methods: {
    async acceptToJoinGroup() {
      try {
        await this.$store.dispatch(ACCEPT_TO_JOIN_GROUP, this.groupInvite.id);
        this.$router.push({ path: `/groups/${this.groupInvite.slug}` });
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
        await this.$store.dispatch(DENY_TO_JOIN_GROUP, this.groupInvite.id);
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
