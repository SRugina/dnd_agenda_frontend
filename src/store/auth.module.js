import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  CHECK_AUTH,
  UPDATE_USER,
  UPDATE_USER_PASSWORD
} from "./actions.type";
import { SET_AUTH, PURGE_AUTH, SET_ERROR } from "./mutations.type";
import idb from "@/common/idb.service";

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state) {
    idb.checkStorage("auth").then(data => {
      if (data != undefined) {
        return data.user;
      } else {
        return state.user;
      }
    });
  },
  isAuthenticated(state) {
    idb.checkStorage("auth").then(data => {
      if (data != undefined) {
        return data.isAuthenticated;
      } else {
        return state.isAuthenticated;
      }
    });
  }
};

const actions = {
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("users/login", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.error);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.post("users", credentials)
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
          reject(response);
        });
    });
  },
  [CHECK_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.get("users/self")
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
        })
        .catch(({ response }) => {
          if (response.status == 401) {
            context.commit(PURGE_AUTH);
          } else {
            context.commit(SET_ERROR, response.data.error);
          }
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_USER](context, payload) {
    const { email, username, image, bio } = payload;
    const user = {
      email,
      username,
      bio,
      image
    };

    return ApiService.patch("users/self", user).then(({ data }) => {
      context.commit(SET_AUTH, data.user);
      return data;
    });
  },
  [UPDATE_USER_PASSWORD](context, payload) {
    const { oldPassword, password } = payload;
    const user = {
      old_password: oldPassword,
      password
    };

    return ApiService.patch("users/self/pwd", user).then(({ data }) => {
      context.commit(SET_AUTH, data.user);
      return data;
    });
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
    idb.saveToStorage("auth", state);
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
    JwtService.saveToken(state.user.token);
    idb.saveToStorage("auth", state);
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = null;
    JwtService.destroyToken();
    idb.saveToStorage("auth", state);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
