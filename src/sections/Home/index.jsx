import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { siteUtils } from '../../utils';

import './css.scss';

const Home = () => {
  document.title = siteUtils.websiteTitle();
  return (<>
    <Header version="hero" />
    <main className="main-content main-home">
      <section>
        <div className="home-hero-wrapper">
          <h2 className="heading heading-main hero-message-top">Level up Pizza Night...</h2>
          <img src="/images/pizza-vector.png" className="home-hero" alt="Pizza" />
          <h3 className="heading heading-sub-main hero-message-bottom">with a Movie!</h3>
        </div>
      </section>
    </main>
    <Footer />
  </>);
};

export default Home;
