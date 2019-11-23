<template>
  <div>
    <div v-if="isLoadingProfiles" class="profile-preview">
      Loading profiles...
    </div>
    <div v-else>
      <div v-if="profiles.length === 0" class="profile-preview">
        No profiles are here... yet.
      </div>
      <RwvProfilePreview
        v-for="(profile, index) in profiles"
        :profile="profile"
        :key="profile.username + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvProfilePreview from "./VProfilePreview";
import VPagination from "./VPagination";
import { FETCH_PROFILES } from "../store/actions.type";

export default {
  name: "RwvProfileList",
  components: {
    RwvProfilePreview,
    VPagination
  },
  props: {
    username: {
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
      if (this.username) {
        filters.username = this.username;
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
      if (this.isLoadingProfiles) {
        return [];
      }
      return [...Array(this.profilesPagesCount).keys()].map(e => e + 1);
    },
    ...mapGetters(["profilesPagesCount", "isLoadingProfiles", "profiles"])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.page = newValue;
      this.fetchProfiles();
    },
    username() {
      this.resetPagination();
      this.fetchProfiles();
    },
    sort() {
      this.resetPagination();
      this.fetchProfiles();
    }
  },
  mounted() {
    this.fetchProfiles();
  },
  methods: {
    fetchProfiles() {
      this.$store.dispatch(FETCH_PROFILES, this.listConfig);
    },
    resetPagination() {
      this.listConfig.page = 1;
      this.currentPage = 1;
    }
  }
};
</script>
