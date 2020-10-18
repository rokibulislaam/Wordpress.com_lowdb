require('dotenv').config();
const path = require('path');
const settingsJSON = require('./wp_com_settings.json');
const settings = {
  client_id: process.env.WP_COM_APP_CLIENT_ID,
  client_secret: process.env.WP_COM_APP_CLIENT_SECRET,
  site: settingsJSON.site || null,
  downloadDir: settingsJSON.downloadDir || path.join(__dirname, 'wp_files'),
  site_url: settingsJSON.site_url || '',
};
module.exports = settings;
