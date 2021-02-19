import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { siteUtils, reactUtils } from '../../utils';
import './css.scss';

const { useBodyClass } = reactUtils;

const About = (props) => {
  useBodyClass('page-about');
  document.title = `About Us - ${siteUtils.websiteTitle()}`;

  return <>
    <Header />
    <main className="main-content main-about">
      <section className="main-content-wrap">
        <h1 className="heading heading-content">About</h1>
        <p className="body-text">Sammy's Socials have been promoting movie health for over 25 years. Started in my early years at Holy-Tech generating nothing but purely electrified moving & talking pictures; we're able to corner the market with our patented movie search algorithm with no verified inverse validity [Greiner, W.; Reinhardt, J. (1996). Film Quantization.] no warranties or guarantees provided under the terms of service.</p>

        <h4 className="heading heading-sub-content">Public Supply</h4>
        <p className="body-text">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam cursus commodo bibendum. Duis at molestie ipsum. Quisque vestibulum massa id nisi eleifend malesuada. Quisque dictum, tellus interdum pharetra iaculis, ipsum libero consequat enim, vel volutpat magna sapien vitae urna. Integer imperdiet egestas nunc nec elementum. Sed ultrices dictum lectus et facilisis. Sed tincidunt porttitor nisl ac porttitor.</p>

        <h4 className="heading heading-sub-content">Innovations</h4>
        <p className="body-text">Integer lacinia sed nisi eget consectetur. Vestibulum ultricies pharetra lacus et tempus. Phasellus placerat blandit metus. Duis iaculis semper ex nec dictum. Mauris ac odio dui. Donec luctus imperdiet turpis et ultricies. Morbi dictum nisl et turpis imperdiet, ac feugiat libero aliquet. Nunc fermentum pharetra erat a euismod. Cras pretium magna vel cursus tincidunt. Nulla id condimentum metus, ac posuere turpis. Etiam efficitur laoreet nulla vel iaculis. Mauris volutpat ante vel massa rutrum luctus. Sed sed arcu et velit facilisis vehicula a ac metus. Aliquam sodales consequat neque id posuere.</p>

        <h4 className="heading heading-sub-content">Guarantee</h4>
        <p className="body-text">Duis eget nisl ac diam tristique cursus. Sed ultricies justo eu accumsan congue. Pellentesque et mattis justo. Aliquam a viverra ipsum, a iaculis lacus. Curabitur vitae libero laoreet, gravida mauris id, viverra purus. Proin ac maximus ante. Aliquam nibh leo, varius sit amet nulla at, euismod tempor dolor.</p>
      </section>
    </main>
    <Footer />
  </>;
};

export default About;
