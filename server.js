import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
app.use(express.json());
import morgan from 'morgan';

import mongoose from 'mongoose';

// пути
import jobRouter from './routes/jobRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

//middleware
import errorHandlerMiddleware from './middleware/ErroeHandlerMiddleware.js';

import authenticateUser from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';

// for uploads
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

import cloudinary from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './public')));

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
	// показывает логи только на ДЕВ
	app.use(morgan('dev'));
}
// for .env

// for get
/* app.get('/', (req, res) => {
	res.send('Hello World 1');
}); */
// for get

// for test
//
app.post('/api/v1/test2', (req, res) => {
	const { name } = req.body;
	res.json({ msg: `hello ${name}` });
});

app.get('/api/v1/test', (req, res) => {
	res.json({ msg: 'test route' });
});
// for test

// for jobs
// защищаем маршруты authenticateUser
// перед тем как выполнить последнюю функц, выполняется authenticateUser (тут проведем проверку)
app.use('/api/v1/jobs', authenticateUser, jobRouter);
// for users
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/users', authenticateUser, userRouter);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './public', 'index.html'));
});

// показывает ошибку
app.use(errorHandlerMiddleware);

// применяем ко всем запросам
app.use('*', (req, res) => {
	res.status(404).json({
		msg: 'not found',
	});
});

const PORT = process.env.PORT || 5100;

/* app.listen(port, () => {
	console.log(`server running on ${port}....`);
}); */

try {
	await mongoose.connect(process.env.MONGO_URL);
	app.listen(PORT, () => {
		console.log(`server running on PORT ${PORT}....`);
	});
} catch (error) {
	console.log(error);
	process.exit(1);
}
