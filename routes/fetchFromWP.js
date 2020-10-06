// todo : add logic and implement wpcom to fetch posts from Wordpress.com

const router = require('express').Router();
const wpcom = require('wpcom');
const { route } = require('./initializePosts');
const initPostsRoute = require('./initializePosts');

router.use(initPostsRoute);

module.exports = router;
