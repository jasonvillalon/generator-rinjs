'use strict';

import React from "react/addons";
import MasterPage from "./components/masterpage.jsx!";
import Index from "./components/pages/index.jsx!"
import About from "./components/pages/about.jsx!"

var master = function(){
  React.render((<MasterPage />), document.body);
};

var main = [master, function() {
  console.log('home');
  React.render((<Index/>), document.getElementById('main_content'));
}];

var routes = {
  "/": main,
  "/about": [master, function(){
    console.log('about');
    React.render((<About/>), document.getElementById('main_content'));
  }]
};

export default routes;
