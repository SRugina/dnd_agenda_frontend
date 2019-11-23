<template>
  <div>
    <div v-if="isLoadingSessionInvites" class="sessionInvite-preview">
      Loading sessionInvites...
    </div>
    <div v-else>
      <div v-if="sessionInvites.length === 0" class="sessionInvite-preview">
        No sessionInvites are here... yet.
      </div>
      <RwvSessionInvitePreview
        v-for="(sessionInvite, index) in sessionInvites"
        :sessionInvite="sessionInvite"
        :key="sessionInvite.title + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvSessionInvitePreview from "./VSessionInvitePreview";
import VPagination from "./VPagination";
import { FETCH_SESSION_INVITES } from "../store/actions.type";

export default {
  name: "RwvSessionInviteList",
  components: {
    RwvSessionInvitePreview,
    VPagination
  },
  props: {
    itemsPerPage: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    listConfig() {
      const filters = {
        page: this.currentPage,
        limit: this.itemsPerPage
      };
      return {
        filters
      };
    },
    pages() {
      if (this.isLoadingSessionInvites) {
        return [];
      }
      return [...Array(this.sessionInvitesPagesCount).keys()].map(e => e + 1);
    },
    ...mapGetters([
      "sessionInvitesPagesCount",
      "isLoadingSessionInvites",
      "sessionInvites"
    ])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.page = newValue;
      this.fetchSessionInvites();
    }
  },
  mounted() {
    this.fetchSessionInvites();
  },
  methods: {
    fetchSessionInvites() {
      this.$store.dispatch(FETCH_SESSION_INVITES, this.listConfig);
    },
    resetPagination() {
      this.listConfig.page = 1;
      this.currentPage = 1;
    }
  }
};
</script>
