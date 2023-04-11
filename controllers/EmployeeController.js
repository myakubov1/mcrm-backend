const bcrypt = require('bcrypt'); // Подключение библиотеки bcrypt
const jwt = require('jsonwebtoken'); // Подключение библиотеки jsonwebtoken
const Employee = require('../models/Employee'); // Подключение модели Employee

class EmployeeController {
  registerEmployee = async (req, res, next) => {
    try {
      const {
        username, firstName, lastName, password, specialties, experience,
      } = req.body;

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
        res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      } else {
        const isPasswordMatch = await bcrypt.compare(password, employee.password);
        if (!isPasswordMatch) {
          res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        } else {
          // Генерация JWT токена
          console.log(process.env.SECRET);
          const token = jwt.sign({ employeeId: employee._id }, process.env.SECRET, { expiresIn: '1h' });

          res.status(200).json({ token });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  getEmployeeProfile = async (req, res, next) => {
    try {
      const { employeeId } = req.user;

      const employee = await Employee.findById(employeeId);

      if (!employee) {
        res.status(404).json({ message: 'Сотрудник не найден' });
      } else {
        res.status(200).json({ employee });
      }
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

      if (!updatedEmployee) {
        res.status(404).json({ message: 'Сотрудник не найден' });
      } else {
        res.status(200).json({ employee: updatedEmployee });
      }
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
