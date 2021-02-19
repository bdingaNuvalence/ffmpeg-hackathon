import { useRef, useCallback, useState, useEffect } from 'react';

const handleStartRecording = ({ setStatusMessage, fileRef, videoRef, recordingInstance, isRecording, setIsRecording, setRecordingInstance, setRecordedUint8Array }) => {
  const { recorder, chunks } = recordingInstance;

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = async () => {
    setRecordedUint8Array(new Uint8Array(await (new Blob(chunks)).arrayBuffer()));
    // setRecordedUint8Array(await (new Blob(chunks)).arrayBuffer());
  };

  recorder.start();

  setStatusMessage('Recording');
  // setRecordingInstance({ chunks, recorder });
};
const handleStopRecording = async ({ setStatusMessage, recordingInstance }) => {
  const { recorder } = recordingInstance;
  setStatusMessage('Stopped');
  recorder.stop();
};
const initNavigator = async ({ setRecordingInstance, setStatusMessage, setIsAllowedRecording, videoRef }) => {
  setStatusMessage('Requesting Permissions');
  try {
    // eslint-disable-next-line no-param-reassign
    videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    await new Promise((resolve) => setTimeout(() => resolve(), 1500));
  } catch (error) {
    console.log('Failed to start User Media', error.message || error);
    setIsAllowedRecording(false);
    setStatusMessage('Permission Request Rejected');
    return;
  }

  const recorder = new MediaRecorder(videoRef.current.srcObject);
  const chunks = [];
  setRecordingInstance({ chunks, recorder });
  await videoRef.current.play();
  // eslint-disable-next-line no-param-reassign
  videoRef.current.muted = true;

  setStatusMessage('Ready to record - Muted to avoid echos');
  setIsAllowedRecording(true);
};
export const useRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAllowedRecording, setIsAllowedRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [recordedUint8Array, setRecordedUint8Array] = useState(null);
  const [watermarkPosition, setWatermarkPosition] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const recorderService = {
    watermarkPosition,
    statusMessage,
    isAllowedRecording,
    setIsAllowedRecording,
    isRecording,
    videoRef,
    fileRef,
    recordedUint8Array,
    recordingInstance,
    setRecordedUint8Array,
    setRecordingInstance,
    setIsRecording,
    setStatusMessage
  };
  const handleWatermarkSelect = useCallback((e) => {
    console.log('-change',e.currentTarget.value);
    setWatermarkPosition(e.currentTarget.value);
  },[setWatermarkPosition]);
  const handleClick = useCallback((e) => {
    if (isRecording) {
      handleStopRecording(recorderService);
    } else {
      handleStartRecording(recorderService);
    }
    setIsRecording(!isRecording);
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [recordingInstance, isRecording, setIsRecording]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    initNavigator(recorderService);
  /* eslint-disable react-hooks/exhaustive-deps */
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (recordedUint8Array) {
      props.handleVideoCapture(recordedUint8Array, { watermarkPosition });
    }
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [recordedUint8Array]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return { ...recorderService, handleWatermarkSelect, watermarkPosition, handleClick };
};
