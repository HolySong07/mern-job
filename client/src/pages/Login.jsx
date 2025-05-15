import { FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import Logo from '../components/Logo.jsx';

import { Link, Form, redirect } from 'react-router-dom';

import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const actionLogin = async ({ request }) => {
	const formData = await request.formData();
	const data = Object.fromEntries(formData);

	try {
		await customFetch.post('/auth/login', data);
		toast.success('Login successful');
		return redirect('/dashboard');
	} catch (error) {
		toast.error(error?.response?.data?.msg);
		return error;
	}
};

const Login = () => {
	const navigate = useNavigate();

	const loginDemoUser = async () => {
		const data = {
			email: 'test@test.com',
			password: 'secret123',
		};
		try {
			await customFetch.post('/auth/login', data);
			toast.success('take a test drive');
			navigate('/dashboard');
		} catch (error) {
			toast.error(error?.response?.data?.msg);
		}
	};

	return (
		<Wrapper>
			<Form method="post" className="form">
				<Logo />
				<h4>Login</h4>
				<FormRow type="email" name="email" defaultValue="mpetrenko@binaryanvil.com" />
				<FormRow type="password" name="password" defaultValue="1234567q" />
				<SubmitBtn formBtn />
				<button type="button" className="btn btn-block" onClick={loginDemoUser}>
					explore the app
				</button>
				<p>
					Not a member yet?
					<Link to="/register" className="member-btn">
						Register
					</Link>
				</p>
			</Form>
		</Wrapper>
	);
};
export default Login;
