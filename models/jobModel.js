import mongoose from 'mongoose';
import { JOB_STATUS } from '../utils/constans.js';
import { JOB_SORT_BY } from '../utils/constans.js';
import { JOB_TYPE } from '../utils/constans.js';

// here saved variables for the models

const JobSchema = new mongoose.Schema(
	{
		company: String,
		position: String,
		jobStatus: {
			type: String,
			enum: Object.values(JOB_STATUS),
			default: JOB_STATUS.PENDING,
		},
		jobType: {
			type: String,
			enum: Object.values(JOB_TYPE),
			default: JOB_TYPE.FULL_TIME,
		},
		jobLocation: {
			type: String,
			default: 'my city',
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('job', JobSchema);
