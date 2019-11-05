<template>
  <div>
    <div v-if="isLoadingSessions" class="session-preview">
      Loading sessions...
    </div>
    <div v-else>
      <div v-if="sortedSessions.length === 0" class="session-preview">
        No sessions are here... yet.
      </div>
      <RwvSessionPreview
        v-for="(session, index) in sortedSessions"
        :session="session"
        :key="session.title + index"
      />
      <VPagination :pages="pages" :currentPage.sync="currentPage" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvSessionPreview from "./VSessionPreview";
import VPagination from "./VPagination";
import { FETCH_SESSIONS } from "../store/actions.type";
import { DateTime } from "luxon";
import { compareAsc, parseISO } from "date-fns";

export default {
  name: "RwvSessionList",
  components: {
    RwvSessionPreview,
    VPagination
  },
  props: {
    dm: {
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
    excludePast: {
      type: Boolean,
      required: false,
      default: true
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
      if (this.dm) {
        filters.dm = this.dm;
      }
      if (this.sort) {
        filters.order = this.sort;
      }
      return {
        filters
      };
    },
    pages() {
      if (this.isLoadingSessions) {
        return [];
      }
      return [...Array(this.sessionsPagesCount).keys()].map(e => e + 1);
    },
    ...mapGetters(["sessionsPagesCount", "isLoadingSessions", "sessions"]),
    sortedSessions() {
      let sessions = this.sessions.map(i => ({ ...i }));
      if (this.excludePast) {
        sessions = sessions.filter(session => {
          const res = compareAsc(
            parseISO(DateTime.fromISO(session.sessionDate).toISODate()),
            new Date()
          );
          if (res === 1) {
            // if session date is later than today, keep
            return true;
          } else if (res === -1) {
            // if session date is earlier than today, discard
            return false;
          } else {
            // if session date is today
            return true;
          }
        });
      }
      return sessions;
    }
  },
  watch: {
    currentPage(newValue) {
      this.listConfig.filters.page = newValue;
      this.fetchSessions();
    },
    dm() {
      this.resetPagination();
      this.fetchSessions();
    },
    sort() {
      this.resetPagination();
      this.fetchSessions();
    },
    excludePast() {
      this.resetPagination();
      this.fetchSessions();
    }
  },
  mounted() {
    this.fetchSessions();
  },
  methods: {
    fetchSessions() {
      this.$store.dispatch(FETCH_SESSIONS, this.listConfig);
    },
    resetPagination() {
      this.listConfig.page = 1;
      this.currentPage = 1;
    }
  }
};
</script>
