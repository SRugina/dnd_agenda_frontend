<template>
  <div>
    <div v-if="isLoadingSessionRequests" class="sessionRequest-preview">
      Loading sessionRequests...
    </div>
    <div v-else>
      <div v-if="sessionRequests.length === 0" class="sessionRequest-preview">
        No sessionRequests are here... yet.
      </div>
      <RwvSessionRequestPreview
        v-for="(sessionRequest, index) in sessionRequests"
        :sessionRequest="sessionRequest"
        :key="sessionRequest.title + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvSessionRequestPreview from "./VSessionRequestPreview";
import VPagination from "./VPagination";
import { FETCH_SESSION_REQUESTS } from "../store/actions.type";

export default {
  name: "RwvSessionRequestList",
  components: {
    RwvSessionRequestPreview,
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
      if (this.isLoadingSessionRequests) {
        return [];
      }
      return [...Array(this.sessionRequestsPagesCount).keys()].map(e => e + 1);
    },
    ...mapGetters([
      "sessionRequestsPagesCount",
      "isLoadingSessionRequests",
      "sessionRequests"
    ])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.page = newValue;
      this.fetchSessionRequests();
    }
  },
  mounted() {
    this.fetchSessionRequests();
  },
  methods: {
    fetchSessionRequests() {
      this.$store.dispatch(FETCH_SESSION_REQUESTS, this.listConfig);
    },
    resetPagination() {
      this.listConfig.page = 1;
      this.currentPage = 1;
    }
  }
};
</script>
