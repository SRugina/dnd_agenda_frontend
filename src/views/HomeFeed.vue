<template>
  <div class="home-feed">
    <RwvSessionList />
  </div>
</template>
<script>
import RwvSessionList from "@/components/SessionList";

export default {
  name: "rwv-home-feed",
  components: {
    RwvSessionList
  }
};
</script>
