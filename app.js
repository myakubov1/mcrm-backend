/* eslint-disable import/extensions */
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routes);
dotenv.config();

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(process.env.PORT, () => console.log(`SERVER STARTED: ${process.env.PORT}`));
  } catch (e) {
    console.log(e);
  }
}

startApp();
