// main js
//alert('here');

import Vue from "vue";

import test from "./vue/test.vue";

const appElement = document.getElementById("app");

if (appElement) {
  const app = new Vue({
    el: "#app",
    data: {
      message: "Hello Vue!"
    },
    components: {
      test: test
    }
  });

  console.log(app);
}
