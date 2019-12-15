import Vue from "vue";
import { SessionsService } from "@/common/api.service";
import {
  FETCH_SESSION,
  SESSION_PUBLISH,
  SESSION_EDIT,
  SESSION_DELETE,
  SESSION_RESET_STATE,
  SESSION_JOIN,
  SESSION_LEAVE,
  CHECK_SESSION_WAITING,
  REMOVE_FROM_SESSION,
  CHECK_SESSION_INVITED
} from "./actions.type";
import { RESET_SESSION_STATE, SET_SESSION } from "./mutations.type";
import { DateTime } from "luxon";
import { parseISO } from "date-fns";
import idb from "@/common/idb.service";

const initialState = {
  session: {
    id: null,
    slug: "",
    title: "",
    description: "",
    dm: null,
    session_date: "",
    date: "",
    time: "",
    colour: null,
    group: null,
    members: [],
    guests: []
  }
};

export const state = { ...initialState };

export const actions = {
  async [FETCH_SESSION](context, sessionSlug, prevSession) {
    // avoid extronuous network call if session exists
    if (prevSession !== undefined) {
      return context.commit(SET_SESSION, prevSession);
    }
    const { data } = await SessionsService.get(sessionSlug);
    const {
      id,
      slug,
      title,
      description,
      dm,
      sessionDate,
      colour,
      group,
      members,
      guests
    } = await data.session;

    const session = {
      id,
      slug,
      title,
      description,
      dm,
      date: parseISO(sessionDate),
      time: DateTime.fromISO(sessionDate).toISOTime(),
      colour,
      group,
      members,
      guests
    };

    context.commit(SET_SESSION, session);
    return data;
  },
  [SESSION_PUBLISH]({ state }) {
    return SessionsService.create(state.session);
  },
  [SESSION_DELETE](context, id) {
    return SessionsService.destroy(id);
  },
  [SESSION_EDIT]({ state }) {
    return SessionsService.update(state.session.id, state.session);
  },
  [SESSION_RESET_STATE]({ commit }) {
    commit(RESET_SESSION_STATE);
  },
  [SESSION_JOIN](context, id) {
    return SessionsService.get(id + "/join");
  },
  [SESSION_LEAVE](context, id) {
    return SessionsService.get(id + "/leave");
  },
  [CHECK_SESSION_WAITING](context, payload) {
    const { session_id, user_id } = payload;
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _reject) => {
      SessionsService.get(`${session_id}/waiting/${user_id}`)
        .then(({ data }) => {
          resolve(data.waiting);
        })
        .catch(() => {
          // not found, so is not waiting and is not a member
          resolve(false);
        });
    });
  },
  [CHECK_SESSION_INVITED](context, payload) {
    const { session_id, user_id } = payload;
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _reject) => {
      SessionsService.get(`${session_id}/invited/${user_id}`)
        .then(({ data }) => {
          resolve(data.invited);
        })
        .catch(() => {
          // not found, so is not invited and is not a member
          resolve(false);
        });
    });
  },
  [REMOVE_FROM_SESSION](context, payload) {
    const { parent_id, user_id } = payload;
    return SessionsService.destroy(`${parent_id}/remove/${user_id}`);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_SESSION](state, session) {
    state.session = session;
    idb.saveToStorage("session", state);
  },
  [RESET_SESSION_STATE]() {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
    idb.saveToStorage("session", state);
  }
};

const getters = {
  session(state) {
    idb.checkStorage("session").then(data => {
      if (data != undefined) {
        return data.session;
      } else {
        return state.session;
      }
    });
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
