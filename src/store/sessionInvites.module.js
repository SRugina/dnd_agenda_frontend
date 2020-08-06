import ApiService from "@/common/api.service";
import {
  FETCH_SESSION_INVITES,
  INVITE_TO_SESSION,
  ACCEPT_TO_JOIN_SESSION,
  DENY_TO_JOIN_SESSION
} from "./actions.type";
import {
  FETCH_SESSION_INVITES_START,
  FETCH_SESSION_INVITES_END
} from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  sessionInvites: [],
  isLoadingSessionInvites: false,
  sessionInvitesPagesCount: 0
};

const getters = {
  sessionInvitesPagesCount(state) {
    idb.checkStorage("sessionInvites").then(data => {
      if (data != undefined) {
        return data.sessionInvitesPagesCount;
      } else {
        return state.sessionInvitesPagesCount;
      }
    });
  },
  sessionInvites(state) {
    idb.checkStorage("sessionInvites").then(data => {
      if (data != undefined) {
        return data.sessionInvites;
      } else {
        state.sessionInvites;
      }
    });
  },
  isLoadingSessionInvites(state) {
    idb.checkStorage("sessionInvites").then(data => {
      if (data != undefined) {
        return data.sessionInvites;
      } else {
        return state.sessionInvites;
      }
    });
  }
};

const actions = {
  [FETCH_SESSION_INVITES]({ commit }, params) {
    commit(FETCH_SESSION_INVITES_START);
    return ApiService.query("users/self/sessions/invites", {
      params: params.filters
    })
      .then(({ data }) => {
        commit(FETCH_SESSION_INVITES_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  [INVITE_TO_SESSION](context, payload) {
    const { parent_id, user_id } = payload;
    return ApiService.get(`sessions/${parent_id}/invite/${user_id}`);
  },
  [ACCEPT_TO_JOIN_SESSION](context, session_id) {
    return ApiService.get(`sessions/${session_id}/invite/accept`);
  },
  [DENY_TO_JOIN_SESSION](context, session_id) {
    return ApiService.get(`sessions/${session_id}/invite/deny`);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_SESSION_INVITES_START](state) {
    state.isLoadingSessionInvites = true;
    idb.saveToStorage("sessionInvites", state);
  },
  [FETCH_SESSION_INVITES_END](
    state,
    { sessionInvites, sessionInvitesPagesCount }
  ) {
    state.sessionInvites = sessionInvites;
    state.sessionInvitesPagesCount = sessionInvitesPagesCount;
    state.isLoadingSessionInvites = false;
    idb.saveToStorage("sessionInvites", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
