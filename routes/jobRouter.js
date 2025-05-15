import { Router } from 'express';
import {
	validateJobInput,
	validateIdParam,
} from '../middleware/ValidationHandlerMiddleware.js';

import { checkForTestUser } from '../middleware/authMiddleware.js';

const router = Router();

import {
	getAllJobs,
	createJob,
	getJob,
	editJob,
	deleteJob,
	showStats,
} from '../controllers/jobController.js';

// router.get('/', getAllJobs);
// router.post('/', createJob);

// loading functions
// checkForTestUser; check this is test user or not
router
	.route('/')
	.get(getAllJobs)
	.post(checkForTestUser, validateJobInput, createJob);

router.route('/stats').get(showStats);

router
	.route('/:id')
	.get(validateIdParam, getJob)
	.patch(checkForTestUser, validateJobInput, validateIdParam, editJob)
	.delete(checkForTestUser, validateIdParam, deleteJob);

export default router;
