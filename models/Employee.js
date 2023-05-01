const { Schema, model } = require('mongoose');

const Employee = new Schema({
  username: {
    type: String, required: true, unique: true, maxlength: 30,
  },
  firstName: { type: String, required: true, maxlength: 30 },
  lastName: { type: String, required: true, maxlength: 30 },
  password: { type: String, required: true },
  specialties: [{ type: Schema.Types.ObjectId, ref: 'Specialty' }],
  experience: { type: Number, required: true, max: 120 },
  date: { type: Date, required: true, default: Date.now },
}, { versionKey: false });

module.exports = model('Employee', Employee);
