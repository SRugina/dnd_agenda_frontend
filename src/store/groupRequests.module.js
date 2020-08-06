import ApiService from "@/common/api.service";
import {
  FETCH_GROUP_REQUESTS,
  ACCEPT_TO_GROUP,
  DENY_TO_GROUP
} from "./actions.type";
import {
  FETCH_GROUP_REQUESTS_START,
  FETCH_GROUP_REQUESTS_END
} from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  groupRequests: [],
  isLoadingGroupRequests: false,
  groupRequestsPagesCount: 0
};

const getters = {
  groupRequestsPagesCount(state) {
    idb.checkStorage("groupRequests").then(data => {
      if (data != undefined) {
        return data.groupRequestsPagesCount;
      } else {
        return state.groupRequestsPagesCount;
      }
    });
  },
  groupRequests(state) {
    idb.checkStorage("groupRequests").then(data => {
      if (data != undefined) {
        return data.groupRequests;
      } else {
        return state.groupRequests;
      }
    });
  },
  isLoadingGroupRequests(state) {
    idb.checkStorage("groupRequests").then(data => {
      if (data != undefined) {
        return data.isLoadingGroupRequests;
      } else {
        return state.isLoadingGroupRequests;
      }
    });
  }
};

const actions = {
  [FETCH_GROUP_REQUESTS]({ commit }, params) {
    commit(FETCH_GROUP_REQUESTS_START);
    return ApiService.query("users/self/groups/requests", {
      params: params.filters
    })
      .then(({ data }) => {
        commit(FETCH_GROUP_REQUESTS_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  },
  [ACCEPT_TO_GROUP](context, payload) {
    const { group_id, user_id } = payload;
    return ApiService.get(`groups/${group_id}/accept/${user_id}`);
  },
  [DENY_TO_GROUP](context, payload) {
    const { group_id, user_id } = payload;
    return ApiService.get(`groups/${group_id}/deny/${user_id}`);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_GROUP_REQUESTS_START](state) {
    state.isLoadingGroupRequests = true;
    idb.saveToStorage("groupRequests", state);
  },
  [FETCH_GROUP_REQUESTS_END](
    state,
    { groupRequests, groupRequestsPagesCount }
  ) {
    state.groupRequests = groupRequests;
    state.groupRequestsPagesCount = groupRequestsPagesCount;
    state.isLoadingGroupRequests = false;
    idb.saveToStorage("groupRequests", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
