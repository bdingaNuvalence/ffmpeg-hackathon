import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export const ffmpeg = createFFmpeg({ log: true });
let isLoaded = false;
const ffmpegLoadPromise = ffmpeg.load()
  .then((result) => {
    isLoaded = true;
    return result;
  })
  .catch((error) => console.log('FFMPEG Failed to load', error.message || error));

export const watermark = async ({ position = 'tl', scaleFactor = 100, opacity = 100, videoUint8, videoFilename, watermark = { file: null, filename: 'watermark.png' } }) => {
  const wasmFilename = 'output.mp4';
  if (!isLoaded) {
    await ffmpegLoadPromise;
    isLoaded = true;
  }
  ffmpeg.FS('writeFile', videoFilename, videoUint8);
  ffmpeg.FS('writeFile', watermark.filename, await fetchFile(watermark.file));

  const positionIndex = {
    tr: 'main_w-overlay_w-10:10',
    br: 'main_w-overlay_w-10:main_h-overlay_w-10',
    tl: '10:10',
    bl: '10:main_w-overlay_w-10',
    mm: '(main_w-overlay_w)/2:(main_h-overlay_h)/2'
  };
  await ffmpeg.run('-i', videoFilename, '-i', watermark.filename, '-filter_complex', `[1:v] scale=iw*${scaleFactor / 100}:-1,format=rgba,colorchannelmixer=aa=${opacity / 100}[fg];[0][fg]overlay=${position in positionIndex ? positionIndex[position] : positionIndex.tl}`, wasmFilename);
  const data = ffmpeg.FS('readFile', wasmFilename);
  return new Blob([data.buffer], { type: 'video/mp4' });
};
