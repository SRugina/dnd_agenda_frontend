import ApiService from "@/common/api.service";
import { FETCH_GROUPS } from "./actions.type";
import { FETCH_GROUPS_START, FETCH_GROUPS_END } from "./mutations.type";

const state = {
  groups: [],
  isLoadingGroups: false,
  groupsPagesCount: 0
};

const getters = {
  groupsPagesCount(state) {
    return state.groupsPagesCount;
  },
  groups(state) {
    return state.groups;
  },
  isLoadingGroups(state) {
    return state.isLoadingGroups;
  }
};

const actions = {
  [FETCH_GROUPS]({ commit }, params) {
    commit(FETCH_GROUPS_START);
    return ApiService.query("groups", { params: params.filters })
      .then(({ data }) => {
        commit(FETCH_GROUPS_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_GROUPS_START](state) {
    state.isLoadingGroups = true;
  },
  [FETCH_GROUPS_END](state, { groups, groupsPagesCount }) {
    state.groups = groups;
    state.groupsPagesCount = groupsPagesCount;
    state.isLoadingGroups = false;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
