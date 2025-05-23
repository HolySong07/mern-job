import Job from '../models/jobModel.js';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';

import mongoose from 'mongoose';
import day from 'dayjs';

export const showStats = async (req, res) => {
	let stats = await Job.aggregate([
		{ $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, // все записи этого юзера
		{ $group: { _id: '$jobStatus', count: { $sum: 1 } } },
	]);

	//вот подсчитали, сколько каких записей есть (конкретного пользователя что сейчас залогинен)
	console.log(stats);

	stats = stats.reduce((acc, curr) => {
		const { _id: title, count } = curr;
		acc[title] = count;
		return acc;
	}, {});

	console.log(stats); // one obj key - value

	const defaultStats = {
		pending: stats.pending || 0,
		interview: stats.interview || 0,
		declined: stats.declined || 0,
	};

	let monthlyApplications = await Job.aggregate([
		{ $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
		{
			$group: {
				_id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
				count: { $sum: 1 },
			},
		},
		{ $sort: { '_id.year': -1, '_id.month': -1 } },
		{ $limit: 6 },
	]);

	monthlyApplications = monthlyApplications
		.map((item) => {
			const {
				_id: { year, month },
				count,
			} = item;

			const date = day()
				.month(month - 1)
				.year(year)
				.format('MMM YY');
			return { date, count };
		})
		.reverse();

	res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

/* let jobs = [
	{
		id: nanoid(),
		company: 'apple',
		position: 'front-end',
	},
	{
		id: nanoid(),
		company: 'google',
		position: 'back-end',
	},
]; */

// получаем все товары с сервера, эту функцию используем в server.js
export const getAllJobs = async (req, res) => {
	const { search, jobStatus, jobType, sort } = req.query;

	const queryObject = {
		createdBy: req.user.userId,
	};

	if (search) {
		queryObject.$or = [
			{ position: { $regex: search, $options: 'i' } },
			{ company: { $regex: search, $options: 'i' } },
		];
	}
	if (jobStatus && jobStatus !== 'all') {
		queryObject.jobStatus = jobStatus;
	}
	if (jobType && jobType !== 'all') {
		queryObject.jobType = jobType;
	}

	const sortOptions = {
		newest: '-createdAt',
		oldest: 'createdAt',
		'a-z': 'position',
		'z-a': '-position',
	};

	const sortKey = sortOptions[sort] || sortOptions.newest;

	// setup pagination
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);

	const totalJobs = await Job.countDocuments(queryObject);
	const numOfPages = Math.ceil(totalJobs / limit);

	res
		.status(StatusCodes.OK)
		.json({ totalJobs, numOfPages, currentPage: page, jobs });
};

// создаем товар один
export const createJob = async (req, res) => {
	//const { company, position } = req.body;
	req.body.createdBy = req.user.userId;
	const job = await Job.create(req.body); // у остальных в модели есть значения по умолчанию...

	res.status(201).json({ job });
};

// получить 1 айтем
export const getJob = async (req, res) => {
	const job = await Job.findById(req.params.id);

	res.status(200).json({ job });
};

// редактирование новости
export const editJob = async (req, res) => {
	const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	res.status(200).json({ job: updatedJob });
};

export const deleteJob = async (req, res) => {
	const removedJob = await Job.findByIdAndDelete(req.params.id);

	res.status(200).json({ job: removedJob, msg: 'removed' });
};
