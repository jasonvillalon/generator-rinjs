"use strict";
"format es6";

import React from "react/addons";
import director from "director";
import routes from "./routes.jsx!";

var router = null;

var route = window.location.hash;
if(!route){
  window.location.href = "/#/";
}

// Ensure the DOM has finished loading
((cb) => {
  if (document.readyState !== "loading") {
    cb();
  } else {
    document.addEventListener("DOMContentLoaded", cb);
  }
})(() => {
  router = director.Router(routes);

  router.configure({
    on: function(){
    },
    recurse: 'forward'
  })

  router.init();
});
