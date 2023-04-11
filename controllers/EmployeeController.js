const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const Employee = require('../models/Employee');

const generateAccessToken = (id, roles, username, date) => {
  const payload = {
    id,
    roles,
    username,
    date,
  };
  return jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });
};

class EmployeeController {
  async registration(req, res) {
    try {
      const {
        username, firstName, lastName, password,
      } = req.body;

      const candidate = await Employee.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const userRole = await Role.findOne({ value: 'DOCTOR' });

      const user = new Employee({
        username,
        firstName,
        lastName,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при регистрации' });
    }
  }

  async login(req, res) {
    console.log('employee login');
    try {
      const { username, password } = req.body;
      const user = await Employee.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `Пользователь ${username} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Введен неверный пароль' });
      }

      const token = generateAccessToken(user._id, user.roles, user.username, user.date);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка входа' });
    }
  }

  async getAll(req, res) {
    try {
      const users = await Employee.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new EmployeeController();
