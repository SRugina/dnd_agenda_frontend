import Vue from "vue";
import { GroupsService } from "@/common/api.service";
import {
  FETCH_GROUP,
  GROUP_PUBLISH,
  GROUP_EDIT,
  GROUP_DELETE,
  GROUP_RESET_STATE,
  GROUP_JOIN,
  GROUP_LEAVE
} from "./actions.type";
import { RESET_GROUP_STATE, SET_GROUP } from "./mutations.type";

const initialState = {
  group: {
    id: null,
    slug: "",
    name: "",
    description: "",
    admin: null,
    members: [],
    session: []
  }
};

export const state = { ...initialState };

export const actions = {
  async [FETCH_GROUP](context, groupSlug, prevGroup) {
    // avoid extronuous network call if group exists
    if (prevGroup !== undefined) {
      return context.commit(SET_GROUP, prevGroup);
    }
    const { data } = await GroupsService.get(groupSlug);
    context.commit(SET_GROUP, data.group);
    return data;
  },
  [GROUP_PUBLISH]({ state }) {
    return GroupsService.create(state.group);
  },
  [GROUP_DELETE](context, id) {
    return GroupsService.destroy(id);
  },
  [GROUP_EDIT]({ state }) {
    return GroupsService.update(state.group.id, state.group);
  },
  [GROUP_RESET_STATE]({ commit }) {
    commit(RESET_GROUP_STATE);
  },
  [GROUP_JOIN](context, id) {
    return GroupsService.get(id + "/join");
  },
  [GROUP_LEAVE](context, id) {
    return GroupsService.get(id + "/leave");
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_GROUP](state, group) {
    state.group = group;
  },
  [RESET_GROUP_STATE]() {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }
};

const getters = {
  group(state) {
    return state.group;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
