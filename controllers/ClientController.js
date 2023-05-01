const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

class ClientController {
  registerClient = async (req, res, next) => {
    try {
      const {
        passport, password,
      } = req.body;

      const clientExists = await Client.exists({ passport });
      if (clientExists) {
        return res.status(401).json({ message: 'Пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newClient = new Client({
        ...req.body,
        password: hashedPassword,
      });

      const savedClient = await newClient.save();

      res.status(201).json({ client: savedClient });
    } catch (error) {
      next(error);
    }
  };

  loginClient = async (req, res, next) => {
    try {
      const { passport, password } = req.body;

      const client = await Client.findOne({ passport });

      if (!client) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      const isPasswordMatch = await bcrypt.compare(password, client.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      // Генерация JWT токена
      const token = jwt.sign({ clientId: client._id }, process.env.SECRET, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  getClientProfile = async (req, res, next) => {
    try {
      const { clientId } = req.params;
      const client = await Client.findById(clientId);

      if (!client) {
        return res.status(404).json({ message: 'Клиент не найден' });
      }
      res.status(200).json({ client });
    } catch (error) {
      next(error);
    }
  };

  getClients = async (req, res, next) => {
    try {
      const clients = await Client.find();

      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  };

  updateClientProfile = async (req, res, next) => {
    try {
      const { clientId } = req.user;

      const {
        passport, firstName, lastName, dateOfBirth, phoneNumber, email,
      } = req.body;

      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        {
          passport, firstName, lastName, dateOfBirth, phoneNumber, email,
        },
        { new: true },
      );

      if (!updatedClient) {
        return res.status(404).json({ message: 'Клиент не найден' });
      }

      res.status(200).json({ employee: updatedClient });
    } catch (error) {
      next(error);
    }
  };

  deleteClientProfile = async (req, res, next) => {
    try {
      const { clientId } = req.user;

      await Client.findByIdAndRemove(clientId);

      res.status(200).json({ message: 'Профиль клиента успешно удален' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ClientController();
