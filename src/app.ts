import type {CorsOptions} from 'cors';
import express from 'express';
import {createServer} from 'http';
import type {ServerOptions} from 'socket.io';
import {Server} from 'socket.io';
import {connectDB} from './config/db';

const cors = require('cors');
const cookieParser = require('cookie-parser');

import verifyJWT from './middleware/verifyJwT';

// connect to db
connectDB();

import env from './config/env';
import authRout from './router/auth';
import awsRout from './router/aws';
import messagesRout from './router/messages';
import usersRout from './router/users';

const restApp = express();

const whitelist: string[] = ['https://mmsc-chatapp.netlify.app', 'http://localhost:3000', 'http://localhost:8081'];

const httpCorsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (whitelist.includes(origin || '') || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	optionsSuccessStatus: 200,
	credentials: true,
};
const socketCorsOptions: Partial<ServerOptions> = {
	cors: {
		origin: (origin, callback) => {
			if (whitelist.includes(origin || '') || !origin) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST'],
	},
};

// built-in middleware for json
restApp.use(express.json());

// cross origin resource sharing
restApp.use(cors(httpCorsOptions));

// middleware for cookies
restApp.use(cookieParser());
restApp.use('/api/auth', authRout);

restApp.use(verifyJWT);
restApp.use('/api/users', usersRout);
restApp.use('/api/messages', messagesRout);
restApp.use('/api/aws', awsRout);

const httpServer = createServer(restApp);
const io = new Server(httpServer, socketCorsOptions);

io.on('connection', (socket) => {
	console.log('User connected: ' + socket.id);
	// socket.emit('me', socket.id);
	socket.on('disconnect', () => {
		console.log('Socket Disconnected');
	});

	socket.on('calluser', ({userToCall, signalData, from}) => {
		console.log(from.user_id + ' send call request to ' + userToCall);
		socket.to(userToCall).emit('calluser', {signal: signalData, from});
	});
	socket.on('answercall', ({from, to, signal}) => {
		console.log(from + ' Answer Call for ' + to);
		socket.to(to).emit('callaccepted', {signal, from});
	});
	socket.on('hangup', ({to, from}) => {
		console.log('User ' + from + ' Hangup the call ' + to);
		socket.to(to).emit('hangup', {from});
	});
	socket.on('busycall', ({to, from}) => {
		console.log('User ' + from.user_id + ' Busy rightnow' + to);
		socket.to(to).emit('numberbusy', {from});
	});

	const totalConnections = io.engine.clientsCount;
	console.log('Total connected clients:', totalConnections);
	// For text messages
	socket.on('joinRoom', (data) => {
		console.log('User ' + data + ' join to room: ' + socket.id);
		socket.join(data);
	});
	socket.on('sendMessage', ({id, sender_id, receiver_id, message, createdAt}) => {
		console.log('Message Send to ' + receiver_id);
		socket.to(receiver_id).emit('getMessage', {
			id,
			sender_id,
			receiver_id,
			message,
			createdAt,
		});
	});
	socket.on('leaveRoom', (data) => {
		console.log('User ' + data + ' leave room');
		socket.leave(data);
	});
});

const PORT = env.PORT;

httpServer.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
