const { Schema, model } = require('mongoose');

const Appointment = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  doctor: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
});

module.exports = model('Appointment', Appointment);
