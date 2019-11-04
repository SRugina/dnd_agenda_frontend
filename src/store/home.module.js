import { SessionsService } from "@/common/api.service";
import { FETCH_SESSIONS } from "./actions.type";
import { FETCH_SESSIONS_START, FETCH_SESSIONS_END } from "./mutations.type";
const state = {
  sessions: [],
  isLoadingSessions: true,
  sessionsPagesCount: 0
};

const getters = {
  sessionsPagesCount(state) {
    return state.sessionsPagesCount;
  },
  sessions(state) {
    return state.sessions;
  },
  isLoadingSessions(state) {
    return state.isLoadingSessions;
  }
};

const actions = {
  [FETCH_SESSIONS]({ commit }, params) {
    commit(FETCH_SESSIONS_START);
    return SessionsService.query(params.filters)
      .then(({ data }) => {
        commit(FETCH_SESSIONS_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_SESSIONS_START](state) {
    state.isLoadingSessions = true;
  },
  [FETCH_SESSIONS_END](state, { sessions, sessionsPagesCount }) {
    state.sessions = sessions;
    state.sessionsPagesCount = sessionsPagesCount;
    state.isLoadingSessions = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
