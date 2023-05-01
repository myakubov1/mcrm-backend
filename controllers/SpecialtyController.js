const Specialty = require('../models/Specialty');

class SpecialtyController {
  createSpecialty = async (req, res, next) => {
    try {
      const {
        name, description,
      } = req.body;

      const newSpecialty = new Specialty({
        name,
        description,
      });

      const savedSpecialty = await newSpecialty.save();

      res.status(201).json({ specialty: savedSpecialty });
    } catch (error) {
      next(error);
    }
  };

  getSpecialty = async (req, res, next) => {
    try {
      const specialties = await Specialty.find()
        .populate('employees')
        .populate({
          path: 'employees',
          populate: {
            path: 'specialties',
            model: 'Specialty',
          },
        });
      res.status(200).json({ specialties });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new SpecialtyController();
