const settings = require('../settings');
function parseWPImagePath(urlpath) {
  const url = new URL(urlpath);
  const pathname = url.pathname;
  const imageSizesPattern = new RegExp('(?:[-_]([0-9]+)x([0-9]+))');
  const folderPattern = new RegExp('(?:([0-9]+)/([0-9]+))');
  const folder =
    (pathname.match(folderPattern) && pathname.match(folderPattern)[0]) ||
    'images';
  const filenameUnsplit = pathname
    .replace(imageSizesPattern, '')
    .split('/')
    .pop();

  const filename = filenameUnsplit.split('.')[0];
  const fileExtension = filenameUnsplit.split('.')[1];

  const search = url.search;
  const params = new URLSearchParams(search);
  let intermadiateMeta = '';

  for (let value of params.keys()) {
    intermadiateMeta = intermadiateMeta + `-${value}-${params.get(value)}`;
  }

  const cleanUrl = `${settings.site_url}/${folder}/${
    filename + intermadiateMeta + '.' + fileExtension
  }`;
  const result = {
    originalUrl: urlpath,
    cleanUrl: cleanUrl,
    folder: folder,
    filename: filename + intermadiateMeta + '.' + fileExtension,
  };
  return result;
}

module.exports = parseWPImagePath;
