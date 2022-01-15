import Vue from "vue";
import VueRouter from "vue-router";
import iView from "iview";
import locale from "iview/dist/locale/en-US";
import routes from "./route";
import store from "./store";
import filters from "./utils/util";
import db from "./utils/db";
import logger from "./utils/logger";
import App from "./App.vue";

import "iview/dist/styles/iview.css";
import "./assets/less/common.less";

Vue.use(VueRouter);

Vue.use(iView, { locale });

Object.keys(filters).forEach((k) => Vue.filter(k, filters[k]));

const router = new VueRouter({
  routes,
});

Vue.prototype.$db = db;

Vue.prototype.$logger = logger;

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
