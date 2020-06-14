const { createReadStream, statSync} = require('fs');
const { pipeline } = require('stream');
const { createServer } = require('http');
const express = require('express')

const app = express();

app.get('/video:id', (req, res) => {
  const path = `public/img/${req.params.id}.mp4`;
  const stat = statSync(path);
  const fileSize = stat.size;
  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  }
  res.writeHead(200, head)
  pipeline(createReadStream(path), res, (err) => {
    if(err) console.log(err);
  })
})

app.get('/audio:id', (req, res) => {
  const path = `public/audio/${req.params.id}.mp3`;
  const stat = statSync(path);
  const fileSize = stat.size;
  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'audio/mp3',
  }
  res.writeHead(200, head)
  pipeline(createReadStream(path), res, (err) => {
    if(err) console.log(err);
  })
})

app.listen(3000)