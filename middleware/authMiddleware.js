import {
	UnauthenticatedError,
	UnauthorizedError,
	BadRequestError,
} from '../Errors/customError.js';
import verifyJWT from '../utils/tokenUtils.js';

const authenticateUser = (req, res, next) => {
	console.log(req.cookies);

	const { token } = req.cookies;
	if (!token) {
		throw new UnauthenticatedError('authentication invalid');
	}

	try {
		const { userId, role } = verifyJWT(token);

		const testUser = userId === '6821a3892d2a1f27b1bdbe52';
		req.user = { userId, role, testUser };

		next();
	} catch (error) {
		throw new UnauthenticatedError('authentication invalid');
	}
};

export const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new UnauthorizedError('Unauthorized to access this route');
		}
		next();
	};
};

export default authenticateUser;

export const checkForTestUser = (req, res, next) => {
	if (req.user.testUser) {
		throw new BadRequestError('Demo User. Read Only!');
	}
	next();
};
