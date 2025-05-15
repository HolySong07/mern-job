import { Link, Outlet } from 'react-router-dom';

export const HomeLayout = () => {
	return (
		<>
			{/* <p>HomeLayou</p>
			<ul>
				<Link to="login">Login page</Link>
				<Link to="register">Register page</Link>
			</ul> */}
			<Outlet />
		</>
	);
};
export default HomeLayout;
