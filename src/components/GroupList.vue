<template>
  <div>
    <div v-if="isLoadingGroups" class="group-preview">
      Loading groups...
    </div>
    <div v-else>
      <div v-if="groups.length === 0" class="group-preview">
        No groups are here... yet.
      </div>
      <RwvGroupPreview
        v-for="(group, index) in groups"
        :group="group"
        :key="group.name + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvGroupPreview from "./VGroupPreview";
import VPagination from "./VPagination";
import { FETCH_GROUPS } from "../store/actions.type";

export default {
  name: "RwvGroupList",
  components: {
    RwvGroupPreview,
    VPagination
  },
  props: {
    name: {
      type: String,
      required: false
    },
    admin: {
      type: String,
      required: false
    },
    itemsPerPage: {
      type: Number,
      required: false,
      default: 10
    },
    sort: {
      type: String,
      required: false,
      default: "asc"
    },
    globalSearch: {
      type: Boolean,
      reqiored: false,
      default: false
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
      if (this.name) {
        filters.name = this.name;
      }
      if (this.admin) {
        filters.admin = this.admin;
      }
      if (this.sort) {
        filters.order = this.sort;
      }
      if (this.globalSearch) {
        filters.global_search = this.globalSearch;
      }
      return {
        filters
      };
    },
    pages() {
      if (this.isLoadingGroups) {
        return [];
      }
      return [...Array(this.groupsPagesCount).keys()].map(e => e + 1);
    },
    ...mapGetters(["groupsPagesCount", "isLoadingGroups", "groups"])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.page = newValue;
      this.fetchGroups();
    },
    name() {
      this.resetPagination();
      this.fetchGroups();
    },
    admin() {
      this.resetPagination();
      this.fetchGroups();
    },
    sort() {
      this.resetPagination();
      this.fetchGroups();
    }
  },
  mounted() {
    this.fetchGroups();
  },
  methods: {
    fetchGroups() {
      this.$store.dispatch(FETCH_GROUPS, this.listConfig);
    },
    resetPagination() {
      this.listConfig.page = 1;
      this.currentPage = 1;
    }
  }
};
</script>
