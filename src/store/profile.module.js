import ApiService from "@/common/api.service";
import { FETCH_PROFILE } from "./actions.type";
import { SET_PROFILE } from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  errors: {},
  profile: {}
};

const getters = {
  profile(state) {
    idb.checkStorage("profile").then(data => {
      if (data != undefined) {
        return data.profile;
      } else {
        return state.profile;
      }
    });
  }
};

const actions = {
  [FETCH_PROFILE](context, payload) {
    const { username } = payload;
    return ApiService.get(`users/${username}`, "profile")
      .then(({ data }) => {
        context.commit(SET_PROFILE, data.profile);
        return data;
      })
      .catch(() => {
        // #todo SET_ERROR cannot work in multiple states
        // context.commit(SET_ERROR, response.data.errors)
      });
  }
};

const mutations = {
  // [SET_ERROR] (state, error) {
  //   state.errors = error
  // },
  [SET_PROFILE](state, profile) {
    state.profile = profile;
    if (!state.profile.image) {
      state.profile.image = "https://dndearall.com/img/smiley.jpg";
    }
    state.errors = {};
    idb.saveToStorage("profile", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
