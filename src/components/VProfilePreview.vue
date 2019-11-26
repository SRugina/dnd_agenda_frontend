<template>
  <div v-if="!removed" class="profile-preview">
    <RwvProfileMeta
      isPreview
      :profile="profile"
      mode="dark"
      style="float: left;"
    />
    <b-link
      v-if="!noBio"
      :to="{ name: 'profile', params: { username: profile.username } }"
      class="preview-link"
    >
      <p v-text="profile.bio" />
      <span>Find out more...</span>
    </b-link>
    <span v-if="actions">
      <b-button variant="outline-danger" size="sm" @click="remove">
        <span>remove</span>
      </b-button>
    </span>
  </div>
</template>

<script>
import RwvProfileMeta from "./ProfileMeta";
import { REMOVE_FROM_SESSION, REMOVE_FROM_GROUP } from "@/store/actions.type";

export default {
  name: "RwvProfilePreview",
  components: {
    RwvProfileMeta
  },
  props: {
    profile: { type: Object, required: true },
    noBio: { type: Boolean, required: false, default: false },
    actions: { type: Boolean, required: false, default: false },
    actionsType: { type: String, required: false, default: "" },
    parentId: { type: Number, required: false }
  },
  data() {
    return {
      removed: false
    };
  },
  methods: {
    async remove() {
      try {
        if (this.parentId) {
          // default to group if actions type not given
          const action =
            this.actionsType === "session"
              ? REMOVE_FROM_SESSION
              : REMOVE_FROM_GROUP;
          await this.$store.dispatch(action, {
            parent_id: this.parentId,
            user_id: this.profile.id
          });
          this.removed = true;
        } else {
          this.$bvToast.toast("Cannot remove from non-existant parent", {
            title: "Error",
            autoHideDelay: 5000,
            variant: "danger"
          });
        }
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
.profile-preview {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem 0;
}
.preview-link {
  color: inherit !important;
}
</style>
