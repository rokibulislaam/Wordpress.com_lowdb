const fs = require('fs');
const fetch = require('node-fetch');

require('dotenv').config();

exports.checkForFile = (file) => {
  try {
    return fs.existsSync(file);
  } catch (err) {
    return false;
  }
};

exports.createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

exports.downloadFile = async (url, path, name) => {
  const API_Token = process.env.WP_COM_API_TOKEN || '';
  if (!fs.existsSync(path)) {
    await fs.mkdirSync(path, { recursive: true });
  }

  if (!checkForFile(path + name)) {
    const res = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + API_Token,
      },
    });

    return await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(path + name);
      res.body.pipe(fileStream);
      res.body.on('error', (err) => {
        console.log('failed to download: ', name);
        reject(err);
      });
      fileStream.on('finish', function () {
        console.log('downloaded: ' + name);
        resolve();
      });
    });
  }
};
