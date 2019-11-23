<template>
  <div>
    <div v-if="isLoadingGroupRequests" class="groupRequest-preview">
      Loading groupRequests...
    </div>
    <div v-else>
      <div v-if="groupRequests.length === 0" class="groupRequest-preview">
        No groupRequests are here... yet.
      </div>
      <RwvGroupRequestPreview
        v-for="(groupRequest, index) in groupRequests"
        :groupRequest="groupRequest"
        :key="groupRequest.title + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvGroupRequestPreview from "./VGroupRequestPreview";
import VPagination from "./VPagination";
import { FETCH_GROUP_REQUESTS } from "../store/actions.type";

export default {
  name: "RwvGroupRequestList",
  components: {
    RwvGroupRequestPreview,
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
      if (this.isLoadingGroupRequests) {
        return [];
      }
      return [...Array(this.groupRequestsPagesCount).keys()].map(e => e + 1);
    },
    ...mapGetters([
      "groupRequestsPagesCount",
      "isLoadingGroupRequests",
      "groupRequests"
    ])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.page = newValue;
      this.fetchGroupRequests();
    }
  },
  mounted() {
    this.fetchGroupRequests();
  },
  methods: {
    fetchGroupRequests() {
      this.$store.dispatch(FETCH_GROUP_REQUESTS, this.listConfig);
    },
    resetPagination() {
      this.listConfig.page = 1;
      this.currentPage = 1;
    }
  }
};
</script>
