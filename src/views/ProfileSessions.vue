<template>
  <div class="profile-page">
    <RwvSessionList
      :dm="dm"
      :items-per-page="5"
      :excludePast="false"
      sort="desc"
    ></RwvSessionList>
  </div>
</template>

<script>
import RwvSessionList from "@/components/SessionList";

export default {
  name: "RwvProfileSessions",
  components: {
    RwvSessionList
  },
  computed: {
    dm() {
      return this.$route.params.username;
    }
  }
};
</script>
