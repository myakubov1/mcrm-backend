const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const Client = require('../models/Client');

const generateAccessToken = (id, roles, passport, date) => {
  const payload = {
    id,
    roles,
    passport,
    date,
  };
  return jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' });
};

class ClientController {
  async registration(req, res) {
    try {
      const {
        passport, firstName, lastName, dateOfBirth, phoneNumber, email, password,
      } = req.body;

      const candidate = await Client.findOne({ passport });
      if (candidate) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
      }

      const hashPassword = bcrypt.hashSync(password, 7);

      const userRole = await Role.findOne({ value: 'CLIENT' });

      const client = new Client({
        passport,
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        email,
        password: hashPassword,
        roles: [userRole.value],
      });
      await client.save();
      return res.json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при регистрации' });
    }
  }

  async login(req, res) {
    try {
      const { passport, password } = req.body;
      const client = await Client.findOne({ passport });
      if (!client) {
        return res.status(400).json({ message: `Пользователь ${passport} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, client.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Введен неверный пароль' });
      }

      const token = generateAccessToken(client._id, client.roles, client.passport, client.date);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка входа' });
    }
  }

  async getAll(req, res) {
    try {
      const users = await Client.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new ClientController();
