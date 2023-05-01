const { Schema, model } = require('mongoose');

const Specialty = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
}, { versionKey: false });

module.exports = model('Specialty', Specialty);
