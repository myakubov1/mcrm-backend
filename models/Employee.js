const { Schema, model } = require('mongoose');

const Employee = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  specialties: [{ type: Schema.Types.ObjectId, ref: 'Specialty' }],
  experience: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
}, { versionKey: false });

module.exports = model('Employee', Employee);
