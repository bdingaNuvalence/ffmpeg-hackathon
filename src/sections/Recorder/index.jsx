/* eslint-disable */
import React, { useRef, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import SearchUI from '../../components/SearchUI';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import Pagination from '../../components/Pagination';
import MovieDetail from '../MovieDetail';
import nuvalenceLogoPng from '../../assets/nuvalence.png';
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

  const handleVideoCapture = async (payload, opts = {}) => {
    console.log('opts.watermarkPosition:', opts.watermarkPosition);
    const waterMark = await window.fetch(nuvalenceLogoPng);
    const waterMarkBlob = await waterMark.blob();
    const waterMarkUint8 = new Uint8Array(await (waterMarkBlob.arrayBuffer()));
    const watermarkOpts = { position: opts.watermarkPosition || 'tl', scaleFactor: 100, opacity: 100, videoUint8: payload, videoFilename: 'recorded', watermark: { file: waterMarkUint8, filename: 'sammy.png' } };
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
  const { watermarkPosition, handleWatermarkSelect, isAllowedRecording, isRecording, statusMessage, handleClick, fileRef, videoRef } = useRecorder(handleVideoCapture);
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
    <select onChange={handleWatermarkSelect}>
      <option value="tl">Top Left</option>
      <option value="tr">Top Right</option>
      <option value="bl">Bottom Left</option>
      <option value="br">Bottom Right</option>
      <option value="mm">Middle Center</option>
    </select>
    {/*<input ref={fileRef} type="file" /><br/>*/}
    <p className="body-text">{statusMessage}</p>
  </>;
};

const RenderedUI = (props) => {
  const history = useHistory();
  if (!props.videoBlob) {
    history.replace('/record');
    return null;
  }
  const videoSrc = useRef(window.URL.createObjectURL(props.videoBlob));
  return <>
    <h1 className="heading heading-content">Processed Video</h1>
    <video src={videoSrc.current} controls />
    <p className="body-text">TEST</p>
  </>;
};
export const MovieRouter = (props) => <>
  <Route exact path={props.match.path}><RecorderUI handleVideoCapture={props.handleVideoCapture} /></Route>
  <Route exact path={`${props.match.path}/rendered`}><RenderedUI videoBlob={props.videoBlob} /></Route>
</>;
export default Recorder;
