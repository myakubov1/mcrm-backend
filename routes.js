const express = require('express');

const EmployeeController = require('./controllers/EmployeeController');
const ClientController = require('./controllers/ClientController');
const AppointmentController = require('./controllers/AppointmentController');
const SpecialtyController = require('./controllers/SpecialtyController');

const AuthMiddleware = require('./middlewares/AuthMiddleware');

const apiRouter = express.Router();

// Роуты для сотрудников
const employeeRouter = express.Router();
employeeRouter.post('/registration', EmployeeController.registerEmployee);
employeeRouter.post('/login', EmployeeController.loginEmployee);
employeeRouter.get('/:employeeId', AuthMiddleware.verifyToken, EmployeeController.getEmployeeProfile);
employeeRouter.put('/', AuthMiddleware.verifyToken, EmployeeController.updateEmployeeProfile);
employeeRouter.delete('/:employeeId', AuthMiddleware.verifyToken, EmployeeController.deleteEmployeeProfile);
employeeRouter.get('/', EmployeeController.getEmployees);
apiRouter.use('/employee', employeeRouter);

// Роуты для клиентов
const clientRouter = express.Router();
clientRouter.post('/registration', ClientController.registerClient);
clientRouter.post('/login', ClientController.loginClient);
clientRouter.get('/:clientId', AuthMiddleware.verifyToken, ClientController.getClientProfile);
clientRouter.put('/', AuthMiddleware.verifyToken, ClientController.updateClientProfile);
clientRouter.delete('/:clientId', AuthMiddleware.verifyToken, ClientController.deleteClientProfile);
clientRouter.get('/', ClientController.getClients);
apiRouter.use('/client', clientRouter);

// Роуты для встреч
const appointmentRouter = express.Router();
appointmentRouter.post('/', AppointmentController.createAppointment);
appointmentRouter.get('/', AuthMiddleware.verifyToken, AppointmentController.getAppointments);
appointmentRouter.get('/:appointmentId', AppointmentController.getAppointmentById);
appointmentRouter.delete('/:appointmentId', AppointmentController.deleteAppointment);
apiRouter.use('/appointment', appointmentRouter);

// Роуты для специальностей
const specialtyRouter = express.Router();
specialtyRouter.post('/', SpecialtyController.createSpecialty);
specialtyRouter.get('/', SpecialtyController.getSpecialty);
apiRouter.use('/specialty', specialtyRouter);
module.exports = apiRouter;
