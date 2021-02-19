import React, { useRef } from 'react';
import ThanksFooter from './ThanksFooter';
import ButtonWidget from './ButtonWidget';
import buttonFactory from './helpers';

import './css.scss';

const Footer = ({ dateStamp }) => {
  const footertRef = useRef(null);
  const onButtonClick = buttonFactory(footertRef);
  const dateMicro = dateStamp || new Date('2021-10-01').getTime();

  return <footer className="footer" ref={footertRef}>
    <div className="footer-fixed-wrapper">
      <ButtonWidget { ...{ onButtonClick }} />
      <div className="footer-content">
        <h6>&copy; { new Date(dateMicro).getFullYear() }</h6>
        <ThanksFooter />
      </div>
    </div>
  </footer>;
};

export default Footer;
