const { Schema, model } = require('mongoose');

const Client = new Schema({
  passport: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  contactInfo: {
    cellPhone: { type: Number },
    homePhone: { type: String },
    address: { type: String },
    email: { type: String },
  },
  personalInfo: {
    gender: { type: String },
    birth: { type: Date },
    patientID: { type: String },
    nationality: { type: String },
    maritalStatus: { type: String },
    emergencyContact: { type: String },
    language: { type: String },
  },
  date: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = model('Client', Client);
