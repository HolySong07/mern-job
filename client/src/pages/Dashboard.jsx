import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar, Loading } from '../components';

import { useState, createContext, useContext } from 'react';
import { checkDefaultTheme } from '../App';
import {
	Outlet,
	redirect,
	useNavigate,
	useLoaderData,
	useNavigation,
} from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const DashboardContext = createContext();

const userQuery = {
	queryKey: ['user'],
	queryFn: async () => {
		const { data } = await customFetch('/users/current-user');
		return data;
	},
};

export const loader = (queryClient) => async () => {
	try {
		return await queryClient.ensureQueryData(userQuery);
	} catch (error) {
		return redirect('/');
	}
};

const Dashboard = ({ prefersDarkMode, queryClient }) => {
	const navigate = useNavigate();
	//const { user } = useLoaderData();
	const { user } = useQuery(userQuery).data;

	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
	const [isAuthError, setIsAuthError] = useState(false); //

	const navigation = useNavigation();
	const isPageLoading = navigation.state === 'loading';

	const logoutUser = async () => {
		await customFetch.get('/auth/logout');
		toast.success('Logging out...');
		navigate('/');
	};

	const toggleDarkTheme = () => {
		const newDarkTheme = !isDarkTheme;
		setIsDarkTheme(newDarkTheme);

		document.body.classList.toggle('dark-theme', newDarkTheme);
		localStorage.setItem('darkTheme', newDarkTheme);
	};

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	};

	customFetch.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error?.response?.status === 401) {
				setIsAuthError(true);
			}
			return Promise.reject(error);
		}
	);

	useEffect(() => {
		if (!isAuthError) return;
		logoutUser();
	}, [isAuthError]);

	return (
		<DashboardContext.Provider
			value={{
				user,
				showSidebar,
				isDarkTheme,
				toggleDarkTheme,
				toggleSidebar,
				logoutUser,
			}}
		>
			<Wrapper>
				<main className="dashboard">
					<SmallSidebar />
					<BigSidebar />
					<div>
						<Navbar />
						<div className="dashboard-page">
							{isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
						</div>
					</div>
				</main>
			</Wrapper>
		</DashboardContext.Provider>
	);
};
export const useDashboardContext = () => useContext(DashboardContext);

export default Dashboard;
