const { Schema, model } = require('mongoose');

const Client = new Schema({
  passport: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  date: { type: Date, required: true, default: Date.now },
}, { versionKey: false });

module.exports = model('Client', Client);
