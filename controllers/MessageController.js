const Message = require('../models/Message');

class MessageController {
  async create(req, res) {
    try {
      const message = await Message.create(req.body);
      res.status(201).json(message);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getAll(req, res) {
    try {
      const messages = await Message.find();
      return res.json(messages);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getByUser(req, res) {
    try {
      if (req.user.username === req.params.destination) {

        const { destination } = req.params;
        const messages = await Message.find({ destination });
        return res.json(messages);
      }
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async update(req, res) {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(req.body._id, req.body, { new: true });
      return res.json(updatedMessage);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const message = await Message.findByIdAndDelete(id);
      res.status(200).json(message);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}
module.exports = new MessageController();
