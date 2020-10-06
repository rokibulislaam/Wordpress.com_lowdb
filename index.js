const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const wp_fetch_route = require('./routes/fetchFromWP');

process.env.NODE_ENV == 'development' && app.use(morgan('combined'));
app.use(helmet());
app.use(cors());

app.listen(port, (err) => {
  if (err) throw new Error(err);
  console.log(`> Server read on http://localhost:${port}`);
});
