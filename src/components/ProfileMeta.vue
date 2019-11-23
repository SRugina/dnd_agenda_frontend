<template>
  <div class="profile-meta">
    <b-link :to="{ name: 'profile', params: { username: profile.username } }">
      <img :src="profile.image" class="user-img" />
    </b-link>
    <div class="info">
      <b-link
        :to="{ name: 'profile', params: { username: profile.username } }"
        :class="mode + `-author`"
        >{{ profile.username }}</b-link
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RwvProfileMeta",
  props: {
    profile: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  }
};
</script>
