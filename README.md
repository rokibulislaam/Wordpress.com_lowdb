# Wordpress.com_lowdb

#### It's a small experimental project aiming to achive:

- Store posts from wordpress.com (could be private site also) locally
- Store the images of the posts locally, or serve with own CDN
- Create a RESTful API from the stored posts because using wordpress.com API could be slower in certain cicumstances
- Whatever you want to add...

### Key Dependencies

- [ExpressJS] - ExpressJS is used to make REST API
- [lowdb] - lowdb is used to store the posts locally
- [WPCOM.JS] - WPCOM.JS is used to fetch posts from wordpress.com

### Getting Started

Before starting the development or production server, make sure to configure the `wp_com_settings.json` file properly.

#### Configuring `wp_com_settings.json`

The basic structure of the settings files is:

```
{
  "client_id": "<app_client_id>",
  "client_secret": "<app_client_secret>",
  "url": {
    "redirect": "<app_redirect_url>"
  },
  "site": "",
  "downloadDir": "",
  "site_url": ""
}
```

- Create a new app from developer.wordpress.com
- After creating an app, copy `client_id`, `client_secret` and `redirect` from developer.wordpress.com/apps and paste in the `settings.json` file.

#### Start the server:

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm run dev
```

For production environments...

```sh
$ npm install --production
$ npm start
```

### Development

Want to contribute? Great!

Wordpress.com_lowdb is a experimental project for the time bening. You are welcome to add any new feature. Make it robus and flexible so that it can be used in production projects.
