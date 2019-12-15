import { SessionsService } from "@/common/api.service";
import { FETCH_SESSIONS } from "./actions.type";
import { FETCH_SESSIONS_START, FETCH_SESSIONS_END } from "./mutations.type";
import idb from "@/common/idb.service";
const state = {
  sessions: [],
  isLoadingSessions: true,
  sessionsPagesCount: 0
};

const getters = {
  sessionsPagesCount(state) {
    idb.checkStorage("home").then(data => {
      if (data != undefined) {
        return data.sessionsPagesCount;
      } else {
        return state.sessionsPagesCount;
      }
    });
  },
  sessions(state) {
    idb.checkStorage("home").then(data => {
      if (data != undefined) {
        return data.sessionsPagesCount;
      } else {
        return state.sessionsPagesCount;
      }
    });
  },
  isLoadingSessions(state) {
    idb.checkStorage("home").then(data => {
      if (data != undefined) {
        return data.sessionsPagesCount;
      } else {
        return state.sessionsPagesCount;
      }
    });
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
    idb.saveToStorage("home", state);
  },
  [FETCH_SESSIONS_END](state, { sessions, sessionsPagesCount }) {
    state.sessions = sessions;
    state.sessionsPagesCount = sessionsPagesCount;
    state.isLoadingSessions = false;
    idb.saveToStorage("home", state);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
