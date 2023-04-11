const Task = require('../models/Task');

class TaskController {
  async create(req, res) {
    try {
      const task = await Task.create(req.body);
      res.status(201).json(task);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getAll(req, res) {
    try {
      const tasks = await Task.find();
      return res.json(tasks);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getByUser(req, res) {
    try {
      if (req.user.username === req.params.user) {
        const { user } = req.params;
        const tasks = await Task.find({ user });
        return res.json(tasks);
      }
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async update(req, res) {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true });
      return res.json(updatedTask);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const message = await Task.findByIdAndDelete(id);
      res.status(200).json(message);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}
module.exports = new TaskController();
