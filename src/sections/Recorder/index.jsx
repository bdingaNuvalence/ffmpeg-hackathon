/* eslint-disable */
import React, { useRef, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import SearchUI from '../../components/SearchUI';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import Pagination from '../../components/Pagination';
import MovieDetail from '../MovieDetail';
import { waterMarkUtils, reactUtils, jsUtils } from '../../utils';

import { useRecorder } from '../../hooks';

import './css.scss';

const { useBodyClass } = reactUtils;
const placeHolderImage = '/images/300x450-coming-soon.png';

const ratioIndex = {
  '16:9': { width: 1080, hieght: 607.5 },
  '3:2': { width: 720, hieght: 480 },
  '4:3': { width: 720, hieght: 540 },
  '21:9': { width: 1080, hieght: 462.86 }
};
const Recorder = (props) => {
  useBodyClass('page-record');
  const [videoBlob, setVideoBlob] = useState(null);
  const history = useHistory();

  const handleVideoCapture = async (payload) => {
    const watermarkOpts = { position: 'tl', scaleFactor: 100, opacity: 100, videoUint8: payload, videoFilename: 'recorded', watermark: { file: './sammy.png', filename: 'sammy.png' } };
    const processed = await waterMarkUtils.watermark(watermarkOpts);
    setVideoBlob(processed);
    history.push('/record/rendered');
  };
  return <>
    <Header />
    <main className="main-content main-movie">
      <section className="main-content-wrap movie">
        <MovieRouter {...{ ...props, handleVideoCapture, videoBlob }} />
      </section>
    </main>
    <Footer />
  </>;
};

const RecorderUI = (props) => {
  const location = useLocation();

  const handleVideoCapture = { ...props, handleVideoCapture: (props.handleVideoCapture ? props.handleVideoCapture : () => {}) };
  const { isAllowedRecording, isRecording, statusMessage, handleClick, fileRef, videoRef } = useRecorder(handleVideoCapture);
  const buttonProps = {
    ...(!isAllowedRecording ? { disabled: !isAllowedRecording } : {})
  };
  const applyVideoDims = {
    width: (videoRef.current && videoRef.current.videoWidth) || ratioIndex['4:3'].width,
    height: (videoRef.current && videoRef.current.videoHeight) || ratioIndex['4:3'].height
  }

  return <>
    <h1 className="heading heading-content">Make a Posting</h1>
    <video {...applyVideoDims} ref={videoRef} controls /><br/>
    <button onClick={handleClick} {...buttonProps} >{isRecording ? 'Recording' : 'Start Recording'}</button><br/>
    {/*<input ref={fileRef} type="file" /><br/>*/}
    <p className="body-text">{statusMessage}</p>
  </>;
};

const RenderedUI = (props) => {
  console.log('URL',window.URL, 'props.videoBlob', props.videoBlob)
  const videoSrc = useRef(window.URL.createObjectURL(props.videoBlob));
  return <>
    <h1 className="heading heading-content">Processed Video</h1>
    <video src={videoSrc.current} controls />
    <p className="body-text">TEST</p>
  </>;
};
export const MovieRouter = (props) => <>
  {(() => {
    console.log(`${props.match.path}/rendered`);
    return null;
  })()}
  <Route exact path={props.match.path}><RecorderUI handleVideoCapture={props.handleVideoCapture} /></Route>
  <Route exact path={`${props.match.path}/rendered`}><RenderedUI videoBlob={props.videoBlob} /></Route>
</>;
export default Recorder;
