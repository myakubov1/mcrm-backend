const { Schema, model } = require('mongoose');

const Task = new Schema({
  value: { type: String, required: true },
  isCompleted: { type: Boolean, required: true, default: false },
  user: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now() },
});

module.exports = model('Task', Task);
