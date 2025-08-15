const dotenv = require('dotenv');
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');

const cors = require('cors');
const cookieParser = require('cookie-parser');
// const path = require('path');

const {connectDB} = require('./config/db');

// load envs
dotenv.config({path: './config/.env'});

// connect to db
connectDB();

const usersRout = require('./router/users');
const messagesRout = require('./router/messages');
const awsRout = require('./router/aws');
const tokenRout = require('./router/token');
const verifyJWT = require('./middleware/verifyJwT');

const app = express();

const whitelist = ['https://mmsc-chatapp.netlify.app', 'http://localhost:3000'];

const corsOptions = {
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	optionsSuccessStatus: 200,
	credentials: true,
};
// built-in middleware for json
app.use(express.json());

// cross origin resource sharing
app.use(cors(corsOptions));

// middleware for cookies
app.use(cookieParser());
app.use('/api/tokens', tokenRout);
app.use('/api/users', usersRout);

app.use(verifyJWT);
app.use('/api/messages', messagesRout);
app.use('/api/aws', awsRout);

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: (origin, callback) => {
			if (whitelist.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST'],
	},
});

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
		console.log(from+' Answer Call for '+to);
		socket.to(to).emit('callaccepted', {signal, from});
	});
	socket.on('hangup', ({to,from}) =>{
		console.log('User '+from+ ' Hangup the call '+to)
		socket.to(to).emit('hangup', {from});

	})
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
	socket.on('sendMessage', ({sender_id, receiver_id, message, createdAt}) => {
		console.log('Message Send to '+receiver_id);
		socket.to(receiver_id).emit('getMessage', {
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
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, console.log(`Server running on PORT: ${PORT}`));
