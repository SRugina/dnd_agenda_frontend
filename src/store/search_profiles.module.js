import ApiService from "@/common/api.service";
import { FETCH_PROFILES } from "./actions.type";
import { FETCH_PROFILES_START, FETCH_PROFILES_END } from "./mutations.type";

const state = {
  profiles: [],
  isLoadingProfiles: false,
  profilesPagesCount: 0
};

const getters = {
  profilesPagesCount(state) {
    return state.profilesPagesCount;
  },
  profiles(state) {
    return state.profiles;
  },
  isLoadingProfiles(state) {
    return state.isLoadingProfiles;
  }
};

const actions = {
  [FETCH_PROFILES]({ commit }, params) {
    commit(FETCH_PROFILES_START);
    return ApiService.query("users", { params: params.filters })
      .then(({ data }) => {
        commit(FETCH_PROFILES_END, data);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [FETCH_PROFILES_START](state) {
    state.isLoadingProfiles = true;
  },
  [FETCH_PROFILES_END](state, { users, usersCount }) {
    state.profiles = users;
    state.profilesPagesCount = usersCount;
    state.isLoadingProfiles = false;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
