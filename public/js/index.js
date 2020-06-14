const jsmediatags = require('jsmediatags');
const fs = require('fs');

const readAudioPro = (file) => {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        const tagsData = tag.tags;
        console.log(tagsData)
        const imgData = tagsData.picture.data;
        const imgDataBuffer = Buffer.from(imgData, 'base64');
        const data = {
          title: tagsData.title,
          artist: tagsData.artist,
          album: tagsData.album,
          imgDataBUffer: imgDataBuffer
        };
        resolve(data);
      },
      onError: (err) => {
        reject('Houston, we have a problem🙄!')
      }
    });
  })
}

const writeFilePro = (file, imgDataBuffer) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, imgDataBuffer, err => {
      if (err) reject('Could not write file 😢');
      resolve('success');
    })
  })
}


(async() => {
  const {title, artist, album, imgDataBUffer} = await readAudioPro('../audio/Breathing.mp3')
  await writeFilePro(`../img/cover_${title}.jpg`, imgDataBUffer)
})()