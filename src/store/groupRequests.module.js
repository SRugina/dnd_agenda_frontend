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

const state = {
  groupRequests: [],
  isLoadingGroupRequests: false,
  groupRequestsPagesCount: 0
};

const getters = {
  groupRequestsPagesCount(state) {
    return state.groupRequestsPagesCount;
  },
  groupRequests(state) {
    return state.groupRequests;
  },
  isLoadingGroupRequests(state) {
    return state.isLoadingGroupRequests;
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
  },
  [FETCH_GROUP_REQUESTS_END](
    state,
    { groupRequests, groupRequestsPagesCount }
  ) {
    state.groupRequests = groupRequests;
    state.groupRequestsPagesCount = groupRequestsPagesCount;
    state.isLoadingGroupRequests = false;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
