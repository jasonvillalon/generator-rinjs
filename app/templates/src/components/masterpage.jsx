'use strict';

import React from "react/addons";

class MasterPage extends React.Component {

  render() {
    return (
      <div className="container">
        <ul className="navigation">
          <li><a className="navHome" href="/#/home">Home</a></li>
          <li><a className="navAbout" href="/#/about">About</a></li>
        </ul>
        <div id="main_content"></div>
      </div>
    );
  }

}

export default MasterPage;
