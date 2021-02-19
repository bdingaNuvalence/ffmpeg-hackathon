import { useRef, useCallback, useMemo, useState, useEffect } from 'react';

const handleStartRecording = ({ setStatusMessage, fileRef, videoRef, recordingInstance, isRecording, setIsRecording, setRecordingInstance, setRecordedBlob }) => {
  const { recorder, chunks } = recordingInstance;

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = async () => {
    // setRecordedBlob(new Uint8Array(await (new Blob(chunks)).arrayBuffer()));
    setRecordedBlob(await (new Blob(chunks)).arrayBuffer());
  };

  recorder.start();

  setStatusMessage('Recording');
  // setRecordingInstance({ chunks, recorder });
};
const handleStopRecording = async ({ setStatusMessage, fileRef, videoRef, recordingInstance, isRecording, setIsRecording, setRecordingInstance, setRecordedBlob }) => {
  const { recorder } = recordingInstance;
  setStatusMessage('Stopped');
  recorder.stop();
};
const handleClickFactory = recorderService => (e) => {
  console.log('clicked');
  const { isRecording, setIsRecording } = recorderService;
  if (isRecording) {
    handleStopRecording(recorderService);
  } else {
    handleStartRecording(recorderService);
  }
  setIsRecording(!isRecording);
};
const initNavigator = async ({ setRecordingInstance, setStatusMessage, setIsAllowedRecording, videoRef }) => {
  setStatusMessage('Requesting Permissions');
  try {
    // eslint-disable-next-line no-param-reassign
    // videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } catch (error) {
    console.log('Failed to start User Media', error.message || error);
    setIsAllowedRecording(false);
    setStatusMessage('Permission Request Rejected');
    return;
  }

  // const recorder = new MediaRecorder(videoRef.current.srcObject);
  // const chunks = [];
  // setRecordingInstance({ chunks, recorder });

  setStatusMessage('Ready to record');
  setIsAllowedRecording(true);
  // await videoRef.current.play();
};
export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAllowedRecording, setIsAllowedRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const recorderService = useMemo(() => ({
    statusMessage,
    isAllowedRecording,
    setIsAllowedRecording,
    isRecording,
    videoRef,
    fileRef,
    recordedBlob,
    recordingInstance,
    setRecordedBlob,
    setRecordingInstance,
    setIsRecording,
    setStatusMessage
  }),
  [
    statusMessage,
    isAllowedRecording,
    setIsAllowedRecording,
    isRecording,
    videoRef,
    fileRef,
    recordedBlob,
    recordingInstance,
    setRecordedBlob,
    setRecordingInstance,
    setIsRecording,
    setStatusMessage
  ]);
  const handleClick = useCallback(() => handleClickFactory(recorderService), [...Object.values(recorderService)]);
  useEffect(() => {
    console.log('useRecorder -> use-effect');
    initNavigator(recorderService);
  }, []);

  return { ...recorderService, handleClick };
};
