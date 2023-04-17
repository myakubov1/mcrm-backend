const bcrypt = require('bcrypt'); // Подключение библиотеки bcrypt
const jwt = require('jsonwebtoken'); // Подключение библиотеки jsonwebtoken
const Employee = require('../models/Employee'); // Подключение модели Employee
const Specialty = require('../models/Specialty');

class EmployeeController {
  registerEmployee = async (req, res, next) => {
    try {
      const {
        username, firstName, lastName, password, specialties, experience,
      } = req.body;

      const employeeExists = await Employee.exists({ username });
      if (employeeExists) {
        return res.status(401).json({ message: 'Пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newEmployee = new Employee({
        username,
        firstName,
        lastName,
        password: hashedPassword,
        specialties,
        experience,
      });

      const savedEmployee = await newEmployee.save();

      await Specialty.updateMany(
        { _id: { $in: specialties } },
        { $push: { employees: savedEmployee._id } },
      );

      res.status(201).json({ employee: savedEmployee });
    } catch (error) {
      next(error);
    }
  };

  loginEmployee = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const employee = await Employee.findOne({ username });

      if (!employee) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      const isPasswordMatch = await bcrypt.compare(password, employee.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      // Генерация JWT токена
      const token = jwt.sign({ employeeId: employee._id }, process.env.SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  getEmployeeProfile = async (req, res, next) => {
    try {
      const { employeeId } = req.user;

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Сотрудник не найден' });
      }

      res.status(200).json({ employee });
    } catch (error) {
      next(error);
    }
  };

  getEmployees = async (req, res, next) => {
    try {
      const employees = await Employee.find();

      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  };

  updateEmployeeProfile = async (req, res, next) => {
    try {
      const { employeeId } = req.user;

      const {
        username, firstName, lastName, specialties, experience,
      } = req.body;

      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        {
          username, firstName, lastName, specialties, experience,
        },
        { new: true },
      );

      // Добавление записи в специльности только тех сотрудников, id которых мы получили
      await Specialty.updateMany(
        { _id: { $in: specialties } },
        { $push: { employees: employeeId } },
      );

      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Сотрудник не найден' });
      }

      res.status(200).json({ employee: updatedEmployee });
    } catch (error) {
      next(error);
    }
  };

  deleteEmployeeProfile = async (req, res, next) => {
    try {
      const { employeeId } = req.user;

      await Employee.findByIdAndRemove(employeeId);

      res.status(200).json({ message: 'Профиль сотрудника успешно удален' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new EmployeeController();
