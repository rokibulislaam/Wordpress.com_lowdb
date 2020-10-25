const htmlParser = require('node-html-parser');
const parseWPImagePath = require('./parseWPImagePath');
const makeid = require('../utils/makeID');
const parseSrcsetURl = require('./parseWPSrcsetURL');
const { downloadFile } = require('./fileHandlers');

const parseHtml = (content) => {
  const parsed = htmlParser.parse(String(content).replace(/\n/g, ''), {
    lowerCaseTagName: false, // convert tag name to lower case (hurt performance heavily)
    script: false, // retrieve content in <script> (hurt performance slightly)
    style: true, // retrieve content in <style> (hurt performance slightly)
    pre: false, // retrieve content in <pre> (hurt performance slightly)
    comment: false,
  });

  parsed.querySelectorAll('img').forEach((image) => {
    const previousURL = image.getAttribute('src');

    if (previousURL) {
      const parsedURL = parseWPImagePath(previousURL);
      const originalUrl = parsedURL.originalUrl;
      const cleanUrl = parsedURL.cleanUrl;
      const subFolder = '/' + parsedURL.folder + '/' || '/';
      const filename = parsedURL.filename || makeid(50) + '.jpeg';
      const srcset = image.getAttribute('srcset') || null;
      if (srcset) {
        const srcsetArr = srcset.split(',');
        if (srcsetArr.length) {
          image.removeAttribute('srcset');
          let srcsetString = '';
          srcsetArr.forEach((url) => {
            const result = parseSrcsetURl(url.replace(/(\s+)(?=https?)/gm, ''));
            srcsetString =
              srcsetString + ' ' + result.cleanUrl + ' ' + result.size + ' , ';
            downloadFile(
              result.originalUrl,
              `${settings.downloadDir}/${result.folder}`,
              `/${result.filename}.${result.fileExtension}`
            );
            // }
          });
          image.setAttribute('srcset', srcsetString);
        }
      }
      image.removeAttribute('src');
      image.setAttribute('src', cleanUrl);
      image.removeAttribute('data-attachment-id');
      image.removeAttribute('data-orig-size');

      image.removeAttribute('data-permalink');
      image.removeAttribute('data-large-file');
      image.removeAttribute('data-orig-file');
      image.removeAttribute('data-comments-opened');
      image.removeAttribute('data-image-meta');
      !image.getAttribute('alt') &&
        image.setAttribute(
          'alt',
          image.getAttribute('data-image-title') ||
            image.getAttribute('data-image-description') ||
            ''
        );
      !image.getAttribute('title') &&
        image.setAttribute(
          'title',
          image.getAttribute('data-image-description') ||
            image.getAttribute('data-image-title') ||
            ''
        );
      image.removeAttribute('data-image-title');
      image.removeAttribute('data-image-description');
      image.removeAttribute('data-medium-file');

      downloadFile(originalUrl, settings.downloadDir + subFolder, filename);
    }
  });

  return parsed.toString();
};

module.exports = parseHtml;
