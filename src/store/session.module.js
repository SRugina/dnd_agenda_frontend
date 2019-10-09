import Vue from "vue";
import {
  SessionsService
} from "@/common/api.service";
import {
  FETCH_SESSION,
  SESSION_PUBLISH,
  SESSION_EDIT,
  SESSION_DELETE,
  SESSION_RESET_STATE
} from "./actions.type";
import {
  RESET_STATE,
  SET_SESSION,
  UPDATE_SESSION_IN_LIST
} from "./mutations.type";

const initialState = {
  session: {
    dm: {},
    title: "",
    description: "",
    body: "",
    tagList: []
  },
  comments: []
};

export const state = { ...initialState };

export const actions = {
  async [FETCH_SESSION](context, articleSlug, prevSession) {
    // avoid extronuous network call if article exists
    if (prevSession !== undefined) {
      return context.commit(SET_SESSION, prevSession);
    }
    const { data } = await SessionsService.get(articleSlug);
    context.commit(SET_SESSION, data.article);
    return data;
  },
  async [FETCH_COMMENTS](context, articleSlug) {
    const { data } = await CommentsService.get(articleSlug);
    context.commit(SET_COMMENTS, data.comments);
    return data.comments;
  },
  async [COMMENT_CREATE](context, payload) {
    await CommentsService.post(payload.slug, payload.comment);
    context.dispatch(FETCH_COMMENTS, payload.slug);
  },
  async [COMMENT_DESTROY](context, payload) {
    await CommentsService.destroy(payload.slug, payload.commentId);
    context.dispatch(FETCH_COMMENTS, payload.slug);
  },
  async [FAVORITE_ADD](context, slug) {
    const { data } = await FavoriteService.add(slug);
    context.commit(UPDATE_SESSION_IN_LIST, data.article, { root: true });
    context.commit(SET_SESSION, data.article);
  },
  async [FAVORITE_REMOVE](context, slug) {
    const { data } = await FavoriteService.remove(slug);
    // Update list as well. This allows us to favorite an article in the Home view.
    context.commit(UPDATE_SESSION_IN_LIST, data.article, { root: true });
    context.commit(SET_SESSION, data.article);
  },
  [SESSION_PUBLISH]({ state }) {
    return SessionsService.create(state.article);
  },
  [SESSION_DELETE](context, slug) {
    return SessionsService.destroy(slug);
  },
  [SESSION_EDIT]({ state }) {
    return SessionsService.update(state.article.slug, state.article);
  },
  [SESSION_EDIT_ADD_TAG](context, tag) {
    context.commit(TAG_ADD, tag);
  },
  [SESSION_EDIT_REMOVE_TAG](context, tag) {
    context.commit(TAG_REMOVE, tag);
  },
  [SESSION_RESET_STATE]({ commit }) {
    commit(RESET_STATE);
  }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SET_SESSION](state, article) {
    state.article = article;
  },
  [SET_COMMENTS](state, comments) {
    state.comments = comments;
  },
  [TAG_ADD](state, tag) {
    state.article.tagList = state.article.tagList.concat([tag]);
  },
  [TAG_REMOVE](state, tag) {
    state.article.tagList = state.article.tagList.filter(t => t !== tag);
  },
  [RESET_STATE]() {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }
};

const getters = {
  article(state) {
    return state.article;
  },
  comments(state) {
    return state.comments;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
