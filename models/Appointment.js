const { Schema, model } = require('mongoose');

const Appointment = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  employee: { type: Schema.Types.ObjectId,ref: 'Employee', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentReason: { type: String, required: true },
}, { versionKey: false });

module.exports = model('Appointment', Appointment);
