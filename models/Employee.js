const { Schema, model } = require('mongoose');

const Employee = new Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  specialties: [{ type: String, ref: 'Role' }],
  experience: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
});

module.exports = model('Employee', Employee);
