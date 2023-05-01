const Appointment = require('../models/Appointment');
const Client = require('../models/Client');
const Employee = require('../models/Employee');

class AppointmentController {
  createAppointment = async (req, res, next) => {
    try {
      const {
        client, employee, appointmentDate, appointmentReason,
      } = req.body;

      const newAppointment = new Appointment({
        client,
        employee,
        appointmentDate,
        appointmentReason,
      });

      const savedAppointment = await newAppointment.save();

      // Добавление записи на прием в список приемов у клиента
      await Client.findByIdAndUpdate(client, { $push: { appointments: savedAppointment._id } });

      // Добавление записи на прием в список приемов у сотрудника
      await Employee.findByIdAndUpdate(employee, { $push: { appointments: savedAppointment._id } });

      res.status(201).json({ appointment: savedAppointment });
    } catch (error) {
      next(error);
    }
  };

  getAppointments = async (req, res, next) => {
    try {
      const { employeeId } = req.user;
      const appointments = await Appointment.find({ employee: employeeId })
        .populate('client');
      res.status(200).json({ appointments });
    } catch (error) {
      next(error);
    }
  };

  getAppointmentById = async (req, res, next) => {
    try {
      const { appointmentId } = req.params;

      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ message: 'Запись на прием не найдена' });
      }

      res.status(200).json({ appointment });
    } catch (error) {
      next(error);
    }
  };

  deleteAppointment = async (req, res, next) => {
    try {
      const { appointmentId } = req.params;

      await Appointment.findByIdAndDelete(appointmentId);

      // Удаление записи на прием из списка приемов у клиента
      await Client.updateMany({ appointments: appointmentId }, { $pull: { appointments: appointmentId } });

      // Удаление записи на прием из списка приемов у сотрудника
      await Employee.updateMany({ appointments: appointmentId }, { $pull: { appointments: appointmentId } });

      res.status(200).json({ message: 'Запись на прием успешно удалена' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AppointmentController();
