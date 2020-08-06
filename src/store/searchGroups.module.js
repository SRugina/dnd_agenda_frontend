import ApiService from "@/common/api.service";
import { FETCH_GROUPS } from "./actions.type";
import { FETCH_GROUPS_START, FETCH_GROUPS_END } from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  groups: [],
  isLoadingGroups: false,
  groupsPagesCount: 0
};

const getters = {
  groupsPagesCount(state) {
    idb.checkStorage("searchGroups").then(data => {
      if (data != undefined) {
        return data.groupsPagesCount;
      } else {
        return state.groupsPagesCount;
      }
    });
  },
  groups(state) {
    idb.checkStorage("searchGroups").then(data => {
      if (data != undefined) {
        return data.groups;
      } else {
        return state.groups;
      }
    });
  },
  isLoadingGroups(state) {
    idb.checkStorage("searchGroups").then(data => {
      if (data != undefined) {
        return data.isLoadingGroups;
      } else {
        return state.isLoadingGroups;
      }
    });
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
    idb.saveToStorage("searchGroups", state);
  },
  [FETCH_GROUPS_END](state, { groups, groupsPagesCount }) {
    state.groups = groups;
    state.groupsPagesCount = groupsPagesCount;
    state.isLoadingGroups = false;
    idb.saveToStorage("searchGroups", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
