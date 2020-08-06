import ApiService from "@/common/api.service";
import {
  FETCH_SESSION_REQUESTS,
  ACCEPT_TO_SESSION,
  DENY_TO_SESSION
} from "./actions.type";
import {
  FETCH_SESSION_REQUESTS_START,
  FETCH_SESSION_REQUESTS_END
} from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  sessionRequests: [],
  isLoadingSessionRequests: false,
  sessionRequestsPagesCount: 0
};

const getters = {
  sessionRequestsPagesCount(state) {
    idb.checkStorage("sessionRequests").then(data => {
      if (data != undefined) {
        return data.sessionRequestsPagesCount;
      } else {
        return state.sessionRequestsPagesCount;
      }
    });
  },
  sessionRequests(state) {
    idb.checkStorage("sessionRequests").then(data => {
      if (data != undefined) {
        return data.sessionRequests;
      } else {
        state.sessionRequests;
      }
    });
  },
  isLoadingSessionRequests(state) {
    idb.checkStorage("sessionRequests").then(data => {
      if (data != undefined) {
        return data.isLoadingSessionRequests;
      } else {
        return state.isLoadingSessionRequests;
      }
    });
  }
};

const actions = {
  [FETCH_SESSION_REQUESTS]({ commit }, params) {
    commit(FETCH_SESSION_REQUESTS_START);
    return ApiService.query("users/self/sessions/requests", {
      params: params.filters
    })
      .then(({ data }) => {
        commit(FETCH_SESSION_REQUESTS_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  [ACCEPT_TO_SESSION](context, payload) {
    const { session_id, user_id } = payload;
    return ApiService.get(`sessions/${session_id}/accept/${user_id}`);
  },
  [DENY_TO_SESSION](context, payload) {
    const { session_id, user_id } = payload;
    return ApiService.get(`sessions/${session_id}/deny/${user_id}`);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_SESSION_REQUESTS_START](state) {
    state.isLoadingSessionRequests = true;
    idb.saveToStorage("sessionRequests", state);
  },
  [FETCH_SESSION_REQUESTS_END](
    state,
    { sessionRequests, sessionRequestsPagesCount }
  ) {
    state.sessionRequests = sessionRequests;
    state.sessionRequestsPagesCount = sessionRequestsPagesCount;
    state.isLoadingSessionRequests = false;
    idb.saveToStorage("sessionRequests", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
