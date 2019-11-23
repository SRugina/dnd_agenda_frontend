<template>
  <div class="group-request-preview">
    <div style="float: left;">
      <RwvProfileMeta
        isPreview
        :profile="groupRequest.profile"
        mode="dark"
        style="float: left;"
      />
      <b-link :to="groupLink" class="preview-link" style="float: left;">
        <p v-text="'to ' + groupRequest.name" />
      </b-link>
    </div>
    <div class="group-request-actions" style="float: right;">
      <b-button
        variant="outline-success"
        size="sm"
        @click="acceptToGroup"
        style="margin-right: 0.5em;"
      >
        <span>Accept</span>
      </b-button>
      <b-button variant="outline-danger" size="sm" @click="denyToGroup">
        <span>Deny</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import RwvProfileMeta from "./ProfileMeta";
import { ACCEPT_TO_GROUP, DENY_TO_GROUP } from "@/store/actions.type";

export default {
  name: "RwvGroupRequestPreview",
  components: {
    RwvProfileMeta
  },
  props: {
    groupRequest: { type: Object, required: true }
  },
  computed: {
    groupLink() {
      return {
        name: "group",
        params: {
          slug: this.groupRequest.slug
        }
      };
    }
  },
  methods: {
    async acceptToGroup() {
      try {
        await this.$store.dispatch(ACCEPT_TO_GROUP, {
          group_id: this.groupRequest.id,
          user_id: this.groupRequest.profile.id
        });
        this.$router.push({ path: `/groups/${this.groupRequest.slug}` });
      } catch (err) {
        this.$bvToast.toast(`${err}`, {
          title: "Error",
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
    },
    async denyToGroup() {
      try {
        await this.$store.dispatch(DENY_TO_GROUP, {
          group_id: this.groupRequest.id,
          user_id: this.groupRequest.profile.id
        });
        this.$router.push({ name: "home" });
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

<style lang="scss" scoped>
.group-request-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
}
.preview-link {
  color: inherit !important;
}
</style>
