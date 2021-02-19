import React from 'react';
import { Link } from 'react-router-dom';
import normanPng from '../../assets/Sammy.png';
import Nav from '../Nav';

import './css.scss';

const Header = (props) => {
  const { version, className } = props;
  const headerProps = {
    className: `header ${className || ''}`
  };
  if (version === 'hero') {
    headerProps.className = `${headerProps.className} header-ver-hero`;
  }

  return <header { ...headerProps }>
    <Link to="/">
      <div className="header-logo-wrap">
        <img src={normanPng} className="header-logo" alt="Portrait of Sammy" />
      </div>
      <h1 className="header-heading-text">Sammy&apos;s Socials</h1>
    </Link>
    <Nav />
  </header>;
};

export default Header;
