'use strict';

import React from "react/addons";
import MasterPage from "./components/masterpage.jsx!";
import Index from "./components/pages/index.jsx!"
import About from "./components/pages/about.jsx!"

var routes = {
  "/": {
    "/home": function() {
      console.log('home');
      React.render((<Index/>), document.getElementById('main_content'));
    },
    "/about": function(){
      console.log('about');
      React.render((<About/>), document.getElementById('main_content'));
    },
    on: function(){
      console.log('master');
      React.render((<MasterPage />), document.body);
      React.render((<Index/>), document.getElementById('main_content'));
    }
  }

};

export default routes;
