/* eslint-disable */
import React from 'react';
import { Route, useRef, useLocation } from 'react-router-dom';
import SearchUI from '../../components/SearchUI';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import Pagination from '../../components/Pagination';
import MovieDetail from '../MovieDetail';
import { reactUtils, jsUtils } from '../../utils';

import { useRecorder } from '../../hooks';

import './css.scss';

const { useBodyClass } = reactUtils;
const placeHolderImage = '/images/300x450-coming-soon.png';

const Movie = (props) => {
  useBodyClass('page-movie');
  return <>
    <Header />
    <main className="main-content main-movie">
      <section className="main-content-wrap movie">
        {<MovieRouter {...{ ...props }} />}
      </section>
    </main>
    <Footer />
  </>;
};

const Recorder = (props) => {
  const location = useLocation();
  // const { isAllowedRecording, isRecording, statusMessage, handleClick, fileRef, videoRef } = useRecorder();
  const buttonProps = {
    // ...(!isAllowedRecording ? { disabled: !isAllowedRecording } : {})
  };

  return <>
    <h1 className="heading heading-content">Make a Posting</h1>
    <button onClick={handleClick} {...buttonProps} >{isRecording ? 'Recording' : 'Start Recording'}</button>
    <video ref={videoRef} controls /><br/>
    <input ref={fileRef} type="file" />
    <p>{statusMessage}</p>
  </>;
};

export const MovieRouter = (props) => <>
  <Route exact path={`${props.match.path}`}><Recorder /></Route>
</>;
export default Recorder;
