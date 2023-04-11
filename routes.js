const express = require('express');

const EmployeeAuthController = require('./controllers/EmployeeController');
const ClientAuthController = require('./controllers/ClientController');
const MessageController = require('./controllers/MessageController');
const TaskController = require('./controllers/TaskController');
const RoleMiddleware = require('./middlewares/RoleMiddleware');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

const apiRouter = express.Router();

// Routes for employees
const employeeRouter = express.Router();
employeeRouter.post('/login', EmployeeAuthController.login);
employeeRouter.post('/registration', EmployeeAuthController.registration);
employeeRouter.get('/doctors', EmployeeAuthController.getAll);
apiRouter.use('/employee', employeeRouter);

// Routes for clients
const clientRouter = express.Router();
clientRouter.post('/login', ClientAuthController.login);
clientRouter.post('/registration', ClientAuthController.registration);
clientRouter.get('/clients', ClientAuthController.getAll);
apiRouter.use('/client', clientRouter);

// Routes for messages
const messagesRouter = express.Router();
messagesRouter.post('/', MessageController.create);
messagesRouter.get('/:destination', AuthMiddleware, MessageController.getByUser);
messagesRouter.get('/', RoleMiddleware('ADMIN'), MessageController.getAll);
messagesRouter.put('/', MessageController.update);
messagesRouter.delete('/:id', MessageController.delete);
apiRouter.use('/messages', messagesRouter);

// Routes for tasks (todos)
const tasksRouter = express.Router();
tasksRouter.post('/', TaskController.create);
tasksRouter.get('/:user', AuthMiddleware, TaskController.getByUser);
tasksRouter.get('/', RoleMiddleware('ADMIN'), TaskController.getAll);
tasksRouter.put('/', TaskController.update);
tasksRouter.delete('/:id', TaskController.delete);
apiRouter.use('/tasks', tasksRouter);

module.exports = apiRouter;
