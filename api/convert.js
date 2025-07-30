// api/convert.js
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers);

  const filename = 'input.webm';
  const output = 'output.mp3';

  await ffmpeg.load();
  ffmpeg.FS('writeFile', filename, new Uint8Array(data));
  await ffmpeg.run('-i', filename, output);
  const out = ffmpeg.FS('readFile', output);

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', 'attachment; filename=output.mp3');
  res.send(Buffer.from(out));
}
