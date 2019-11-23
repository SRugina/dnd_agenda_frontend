import Vue from "vue";
import Vuex from "vuex";

import home from "./home.module";
import auth from "./auth.module";
import session from "./session.module";
import profile from "./profile.module";
import searchProfiles from "./searchProfiles.module";
import searchGroups from "./searchGroups.module";
import group from "./group.module";
import sessionInvites from "./sessionInvites.module";
import sessionRequests from "./sessionRequests.module";
import groupInvites from "./groupInvites.module";
import groupRequests from "./groupRequests.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    auth,
    session,
    profile,
    searchProfiles,
    searchGroups,
    group,
    sessionInvites,
    sessionRequests,
    groupInvites,
    groupRequests
  }
});
