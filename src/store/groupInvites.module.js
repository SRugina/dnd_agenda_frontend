import ApiService from "@/common/api.service";
import {
  FETCH_GROUP_INVITES,
  INVITE_TO_GROUP,
  ACCEPT_TO_JOIN_GROUP,
  DENY_TO_JOIN_GROUP
} from "./actions.type";
import {
  FETCH_GROUP_INVITES_START,
  FETCH_GROUP_INVITES_END
} from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  groupInvites: [],
  isLoadingGroupInvites: false,
  groupInvitesPagesCount: 0
};

const getters = {
  groupInvitesPagesCount(state) {
    idb.checkStorage("groupInvites").then(data => {
      if (data != undefined) {
        return data.groupInvitesPagesCount;
      } else {
        return state.groupInvitesPagesCount;
      }
    });
  },
  groupInvites(state) {
    idb.checkStorage("groupInvites").then(data => {
      if (data != undefined) {
        return data.groupInvites;
      } else {
        return state.groupInvites;
      }
    });
  },
  isLoadingGroupInvites(state) {
    idb.checkStorage("groupInvites").then(data => {
      if (data != undefined) {
        return data.isLoadingGroupInvites;
      } else {
        return state.isLoadingGroupInvites;
      }
    });
  }
};

const actions = {
  [FETCH_GROUP_INVITES]({ commit }, params) {
    commit(FETCH_GROUP_INVITES_START);
    return ApiService.query("users/self/groups/invites", {
      params: params.filters
    })
      .then(({ data }) => {
        commit(FETCH_GROUP_INVITES_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  [INVITE_TO_GROUP](context, payload) {
    const { parent_id, user_id } = payload;
    return ApiService.get(`groups/${parent_id}/invite/${user_id}`);
  },
  [ACCEPT_TO_JOIN_GROUP](context, group_id) {
    return ApiService.get(`groups/${group_id}/invite/accept`);
  },
  [DENY_TO_JOIN_GROUP](context, group_id) {
    return ApiService.get(`groups/${group_id}/invite/deny`);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_GROUP_INVITES_START](state) {
    state.isLoadingGroupInvites = true;
    idb.saveToStorage("groupInvites", state);
  },
  [FETCH_GROUP_INVITES_END](state, { groupInvites, groupInvitesPagesCount }) {
    state.groupInvites = groupInvites;
    state.groupInvitesPagesCount = groupInvitesPagesCount;
    state.isLoadingGroupInvites = false;
    idb.saveToStorage("groupInvites", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
