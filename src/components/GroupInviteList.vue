<template>
  <div>
    <div v-if="isLoadingGroupInvites" class="groupInvite-preview">
      Loading groupInvites...
    </div>
    <div v-else>
      <div v-if="groupInvites.length === 0" class="groupInvite-preview">
        No groupInvites are here... yet.
      </div>
      <RwvGroupInvitePreview
        v-for="(groupInvite, index) in groupInvites"
        :groupInvite="groupInvite"
        :key="groupInvite.title + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvGroupInvitePreview from "./VGroupInvitePreview";
import VPagination from "./VPagination";
import { FETCH_GROUP_INVITES } from "../store/actions.type";

export default {
  name: "RwvGroupInviteList",
  components: {
    RwvGroupInvitePreview,
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
      if (this.isLoadingGroupInvites) {
        return [];
      }
      return [...Array(this.groupInvitesPagesCount).keys()].map(e => e + 1);
    },
    ...mapGetters([
      "groupInvitesPagesCount",
      "isLoadingGroupInvites",
      "groupInvites"
    ])
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.page = newValue;
      this.fetchGroupInvites();
    }
  },
  mounted() {
    this.fetchGroupInvites();
  },
  methods: {
    fetchGroupInvites() {
      this.$store.dispatch(FETCH_GROUP_INVITES, this.listConfig);
    },
    resetPagination() {
      this.listConfig.page = 1;
      this.currentPage = 1;
    }
  }
};
</script>
