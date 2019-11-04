import { SessionsService } from "@/common/api.service";
import { FETCH_SESSION } from "./actions.type";
import { SET_SESSION } from "./mutations.type";

export const state = {
  session: {}
};

export const actions = {
  [FETCH_SESSION](context, sessionSlug) {
    return SessionsService.get(sessionSlug)
      .then(({ data }) => {
        context.commit(SET_SESSION, data.session);
      })
      .catch(error => {
        throw new Error(error);
      });
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_SESSION](state, session) {
    state.session = session;
  }
};

export default {
  state,
  actions,
  mutations
};
