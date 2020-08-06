import ApiService from "@/common/api.service";
import { FETCH_PROFILES } from "./actions.type";
import { FETCH_PROFILES_START, FETCH_PROFILES_END } from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  profiles: [],
  isLoadingProfiles: false,
  profilesPagesCount: 0
};

const getters = {
  profilesPagesCount(state) {
    idb.checkStorage("searchProfiles").then(data => {
      if (data != undefined) {
        return data.profilesPagesCount;
      } else {
        return state.profilesPagesCount;
      }
    });
  },
  profiles(state) {
    idb.checkStorage("searchProfiles").then(data => {
      if (data != undefined) {
        return data.profiles;
      } else {
        state.profiles;
      }
    });
  },
  isLoadingProfiles(state) {
    idb.checkStorage("searchProfiles").then(data => {
      if (data != undefined) {
        return data.isLoadingProfiles;
      } else {
        return state.isLoadingProfiles;
      }
    });
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
    idb.saveToStorage("searchProfiles", state);
  },
  [FETCH_PROFILES_END](state, { users, usersPagesCount }) {
    state.profiles = users;
    state.profilesPagesCount = usersPagesCount;
    state.isLoadingProfiles = false;
    idb.saveToStorage("searchProfiles", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
