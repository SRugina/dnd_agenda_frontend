import Vue from "vue";
import Vuex from "vuex";

import home from "./home.module";
import auth from "./auth.module";
import session from "./session.module";
import profile from "./profile.module";
import search_profiles from "./search_profiles.module";
import search_groups from "./search_groups.module";
import group from "./group.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    auth,
    session,
    profile,
    search_profiles,
    search_groups,
    group
  }
});
