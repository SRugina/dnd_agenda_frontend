<template v-show="errors">
  <div class="error-messages">
    {{ showErrors }}
  </div>
</template>

<script>
export default {
  name: "RwvListErorrs",
  props: {
    errors: { type: Object, required: true }
  },
  computed: {
    showErrors() {
      for (let key in this.errors) {
        this.$bvToast.toast(`${this.errors[key][0]}`, {
          title: `${key}`,
          autoHideDelay: 5000,
          variant: "danger"
        });
      }
      return null;
    }
  }
};
</script>
