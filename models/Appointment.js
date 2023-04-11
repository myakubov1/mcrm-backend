const { Schema, model } = require('mongoose');

const Appointment = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  employee: { type: Schema.Types.ObjectId,ref: 'Employee', required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
}, { versionKey: false });

module.exports = model('Appointment', Appointment);
