import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/common/jwt.service";
import { API_URL } from "@/common/config";

import { DateTime } from "luxon";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
  },

  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Token ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },

  get(resource, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`);
    // .catch(error => {
    //   if (error.response) {
    //     return error.response;
    //   }
    //   throw new Error(`[RWV] ApiService ${error}`);
    // });
  },

  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  update(resource, slug, params) {
    return Vue.axios.patch(`${resource}/${slug}`, params);
  },

  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  patch(resource, params) {
    return Vue.axios.patch(`${resource}`, params);
  },

  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
};

export default ApiService;

export const SessionsService = {
  query(params) {
    return ApiService.query("sessions", {
      params: params
    });
  },
  get(slug) {
    return ApiService.get("sessions", slug);
  },
  create(params) {
    const { title, description, dm, date, time, colour, group } = params;
    const session = {
      title,
      description,
      dm: Number(dm),
      session_date: DateTime.fromISO(
        date.toISOString().slice(0, -14) + time.slice(10)
      ).toISO(),
      colour,
      group: Number(group)
    };
    return ApiService.post("sessions", session);
  },
  update(id, params) {
    const { title, description, dm, date, time, colour, group } = params;
    const session = {
      title,
      description,
      dm: Number(dm),
      session_date: DateTime.fromISO(
        date.toISOString().slice(0, -14) + time.slice(10)
      ).toISO(),
      colour,
      group: Number(group)
    };
    return ApiService.update("sessions", id, session);
  },
  destroy(id) {
    return ApiService.delete(`sessions/${id}`);
  }
};

export const GroupsService = {
  query(params) {
    return ApiService.query("groups", {
      params: params
    });
  },
  get(slug) {
    return ApiService.get("groups", slug);
  },
  create(params) {
    const { name, description, admin } = params;
    const group = {
      name,
      description,
      admin: Number(admin)
    };
    return ApiService.post("groups", group);
  },
  update(id, params) {
    return ApiService.update("groups", id, { group: params });
  },
  destroy(id) {
    return ApiService.delete(`groups/${id}`);
  }
};
