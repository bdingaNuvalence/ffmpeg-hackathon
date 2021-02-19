import React from 'react';
import { Link } from 'react-router-dom';

import './css.scss';

const Nav = (props) => {
  return <nav className="nav">
    <ul className="clean-list">
      <li><Link to="/"><span>Home</span></Link></li>
      <li><Link to="/record"><span>Record</span></Link></li>
    </ul>
  </nav>;
};

export default Nav;
