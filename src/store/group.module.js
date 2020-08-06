import Vue from "vue";
import { GroupsService } from "@/common/api.service";
import {
  FETCH_GROUP,
  GROUP_PUBLISH,
  GROUP_EDIT,
  GROUP_DELETE,
  GROUP_RESET_STATE,
  GROUP_JOIN,
  GROUP_LEAVE,
  CHECK_GROUP_WAITING,
  REMOVE_FROM_GROUP,
  CHECK_GROUP_INVITED
} from "./actions.type";
import { RESET_GROUP_STATE, SET_GROUP } from "./mutations.type";
import idb from "@/common/idb.service";

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
    return GroupsService.get(`${id}/join`);
  },
  [GROUP_LEAVE](context, id) {
    return GroupsService.destroy(`${id}/leave`);
  },
  [CHECK_GROUP_WAITING](context, payload) {
    const { group_id, user_id } = payload;
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _reject) => {
      GroupsService.get(`${group_id}/waiting/${user_id}`)
        .then(({ data }) => {
          resolve(data.waiting);
        })
        .catch(() => {
          // not found, so is not waiting and is not a member
          resolve(false);
        });
    });
  },
  [CHECK_GROUP_INVITED](context, payload) {
    const { group_id, user_id } = payload;
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _reject) => {
      GroupsService.get(`${group_id}/invited/${user_id}`)
        .then(({ data }) => {
          resolve(data.invited);
        })
        .catch(() => {
          // not found, so is not invited and is not a member
          resolve(false);
        });
    });
  },
  [REMOVE_FROM_GROUP](context, payload) {
    const { parent_id, user_id } = payload;
    return GroupsService.destroy(`${parent_id}/remove/${user_id}`);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_GROUP](state, group) {
    state.group = group;
    idb.saveToStorage("group", state);
  },
  [RESET_GROUP_STATE]() {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
    idb.saveToStorage("group", state);
  }
};

const getters = {
  group(state) {
    idb.checkStorage("group").then(data => {
      if (data != undefined) {
        return data.group;
      } else {
        return state.group;
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
