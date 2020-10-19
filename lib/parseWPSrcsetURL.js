const settings = require('../settings')
const makeid = require('../utils/makeID')


const parseSrcsetURl = (urlpath) => {
    const imageSizesPattern = new RegExp('(?:[-_]([0-9]+)x([0-9]+))');
    const folderPattern = new RegExp('(?:([0-9]+)/([0-9]+))');
    const srcsetPattern = new RegExp(/(?:\??)w=(\d+)(?:\&)?;?h=(\d+)\s+?(\d+w?)/);
    const widthPattern = /\s+\d+w/;
  
    const replacedWidthUrlPath = String(urlpath).replace(widthPattern, '');
  
    const sizesMatch = urlpath.match(imageSizesPattern);
    const folderMatch = urlpath.match(folderPattern);
    const srcsetMatch = urlpath.match(srcsetPattern);
    const result = {
      originalUrl: replacedWidthUrlPath,
    };
  
    const filename = replacedWidthUrlPath
      .split('/')
      .pop()
      .split('?')[0]
      .split('.')[0];
    const fileExtension =
      replacedWidthUrlPath.split('/').pop().split('?')[0].split('.')[1] || 'file';
  
  
    if (sizesMatch) {
      result.width = Number(sizesMatch[1]);
      result.height = Number(sizesMatch[2]);
    }
  
    if (srcsetMatch) {
      result.w = srcsetMatch[1];
      result.h = srcsetMatch[2];
      result.size = srcsetMatch[3] || '';
    } else {
      result.w = '';
      result.h = '';
      result.size =
        (urlpath.match(widthPattern) && urlpath.match(widthPattern)[0]) || '';
    }
  
    if (folderMatch) {
      result.folder = folderMatch[0];
    }
  
    if (filename) {
      result.filename = `${filename}${result.w ? '-w' : ''}${result.w}${
        result.h ? '-h' : ''
      }${result.h}`;
    } else {
      result.filename = makeid(20);
    }
    if (fileExtension) {
      result.fileExtension = fileExtension;
    } else {
      result.fileExtension = 'file';
    }
  
    const cleanUrl = `${settings.site_url}/${result.folder || 'images'}/${
      result.filename
    }.${result.fileExtension || 'file'}`;
  
    result.cleanUrl = cleanUrl;
  
    return result;
};
  
module.exports = parseSrcsetURl;