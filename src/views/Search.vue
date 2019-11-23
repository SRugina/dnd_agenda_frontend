<template>
  <div class="search">
    <RwvSessionList v-if="type === 'session'" :title="slug" />
    <RwvGroupList globalSearch v-else-if="type === 'group'" :name="slug" />
    <RwvProfileList globalSearch v-else-if="type == 'user'" :name="slug" />
    <span v-else></span>
  </div>
</template>
<script>
import RwvSessionList from "@/components/SessionList";
import RwvGroupList from "@/components/GroupList";
import RwvProfileList from "@/components/ProfileList";

export default {
  name: "rwv-search",
  props: {
    type: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: false
    }
  },
  components: {
    RwvSessionList,
    RwvGroupList,
    RwvProfileList
  },
  beforeRouteEnter(to, from, next) {
    if (
      !(
        to.params.type &&
        (to.params.type == "group" ||
          to.params.type == "session" ||
          to.params.type == "user")
      )
    ) {
      next({ path: "/" });
    } else {
      next();
    }
  }
};
</script>
