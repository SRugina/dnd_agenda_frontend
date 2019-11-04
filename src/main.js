import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import VCalendar from "v-calendar";

import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";

import { CoolSelectPlugin } from "vue-cool-select";
import "vue-cool-select/dist/themes/bootstrap.css";

import { CHECK_AUTH } from "./store/actions.type";
import ApiService from "./common/api.service";
import DateFilter from "./common/date.filter";
import ErrorFilter from "./common/error.filter";

import BootstrapVue from "bootstrap-vue";

import "./custom.scss";

Vue.use(BootstrapVue);

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: "v",
  masks: {
    title: "MMMM YYYY",
    weekdays: "W",
    navMonths: "MMM",
    input: ["YYYY-MM-DD", "YYYY/MM/DD"],
    dayPopover: "WWW, MMM D, YYYY",
    data: ["YYYY-MM-DD", "YYYY/MM/DD"]
  }
});

Vue.use(Datetime);

Vue.use(CoolSelectPlugin);

Vue.config.productionTip = false;
Vue.filter("date", DateFilter);
Vue.filter("error", ErrorFilter);

ApiService.init();

// Ensure we checked auth before each page load.
router.beforeEach((to, from, next) =>
  Promise.all([store.dispatch(CHECK_AUTH)]).then(next)
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
