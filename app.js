import { createFFmpeg, fetchFile } from 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';

const ffmpeg = createFFmpeg({ log: true });

const uploader = document.getElementById('uploader');
const convertBtn = document.getElementById('convertBtn');
const statusText = document.getElementById('statusText');
const statusContainer = document.getElementById('statusContainer');
const progressBar = document.getElementById('progressBar');

convertBtn.addEventListener('click', async () => {
  if (!uploader.files.length) {
    alert('Please select a WebM file.');
    return;
  }

  convertBtn.disabled = true;
  statusContainer.classList.remove('hidden');
  statusText.textContent = 'Loading FFmpeg...';
  progressBar.value = 0;

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const file = uploader.files[0];
  const inputName = 'input.webm';
  const outputName = 'output.mp3';

  ffmpeg.FS('writeFile', inputName, await fetchFile(file));

  statusText.textContent = 'Converting...';
  progressBar.value = 0;

  ffmpeg.setProgress(({ ratio }) => {
    const percent = Math.min(100, Math.round(ratio * 100));
    progressBar.value = percent;
    statusText.textContent = `Converting... ${percent}%`;
  });

  await ffmpeg.run('-i', inputName, '-vn', outputName);

  const data = ffmpeg.FS('readFile', outputName);
  const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = file.name.replace(/\.webm$/i, '.mp3');
  a.click();

  statusText.textContent = 'Conversion complete!';
  progressBar.value = 100;
  convertBtn.disabled = false;
});
