"use strict";
"format es6";

import React from "react/addons";

class Page extends React.Component {

  render() {
    return (
      <div className="container">
        Hello World!
      </div>
    );
  }

}

// Ensure the DOM has finished loading
((cb) => {
  if (document.readyState !== "loading") {
    cb();
  } else {
    document.addEventListener("DOMContentLoaded", cb);
  }
})(() => {

  React.render((<Page/>), document.body);

});
