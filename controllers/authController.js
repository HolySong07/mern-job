import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';

import { UnauthenticatedError } from '../Errors/customError.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { createJWT } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
	// если регается первый, ты админ
	const isFirstAccount = (await User.countDocuments()) === 0;
	req.body.role = isFirstAccount ? 'admin' : 'user';

	// хешируем пароль
	const hashedPassword = await hashPassword(req.body.password);
	req.body.password = hashedPassword;

	const user = await User.create(req.body);
	res.status(StatusCodes.CREATED).json({ user });
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email: req.body.email });

	const isValidUser = user && (await comparePassword(password, user.password));

	if (!isValidUser) throw new UnauthenticatedError('invalid credentials');

	const token = createJWT({ userId: user._id, role: user.role });
	// res.json({token});
	const oneDay = 1000 * 60 * 60 * 24;

	res.cookie('token', token, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === 'production',
	});
	res.status(StatusCodes.OK).json({ msg: 'user logged' });
};

export const logout = (req, res) => {
	res.cookie('token', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
