import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/HomeFeed")
        },
        {
          path: "",
          name: "search-sessions",
          component: () => import("@/views/SearchSessions")
        }
      ]
    },
    {
      name: "login",
      path: "/login",
      component: () => import("@/views/Login")
    },
    {
      name: "register",
      path: "/register",
      component: () => import("@/views/Register")
    },
    {
      name: "settings",
      path: "/settings",
      component: () => import("@/views/Settings")
    },
    {
      name: "settings-password",
      path: "/settings/password",
      component: () => import("@/views/SettingsPassword")
    },
    // Handle child routes with a default, by giving the name to the
    // child.
    // SO: https://github.com/vuejs/vue-router/issues/777
    {
      path: "/@:username",
      component: () => import("@/views/Profile"),
      children: [
        {
          path: "",
          name: "profile",
          component: () => import("@/views/ProfileSessions")
        }
      ]
    },
    {
      name: "session",
      path: "/sessions/:slug",
      component: () => import("@/views/Session"),
      props: true
    },
    {
      name: "session-edit",
      path: "/session-editor/:slug?",
      props: true,
      component: () => import("@/views/SessionEdit")
    },
    {
      name: "session-dm-edit",
      path: "/session-dm-editor/:slug",
      props: true,
      component: () => import("@/views/SessionDMEdit")
    },
    {
      name: "group",
      path: "/groups/:slug",
      component: () => import("@/views/Group"),
      props: true
    },
    {
      name: "group-edit",
      path: "/group-editor/:slug?",
      props: true,
      component: () => import("@/views/GroupEdit")
    },
    {
      name: "group-admin-edit",
      path: "/group-admin-editor/:slug",
      props: true,
      component: () => import("@/views/GroupAdminEdit")
    }
  ]
});
