const { Schema, model } = require('mongoose');

const Message = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  destination: { type: String, required: true },
  // avatar: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now() },
});

module.exports = model('Message', Message);
