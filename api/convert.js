import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Only POST allowed');
    return;
  }
  
  try {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    const fileBuffer = Buffer.from(await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    }));

    ffmpeg.FS('writeFile', 'input.webm', fileBuffer);

    await ffmpeg.run('-i', 'input.webm', '-vn', 'output.mp3');

    const data = ffmpeg.FS('readFile', 'output.mp3');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(data.buffer));
  } catch (err) {
    res.status(500).send(err.message);
  }
}
