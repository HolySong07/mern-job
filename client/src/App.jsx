import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
	AddJob,
	Admin,
	AllJobs,
	Dashboard,
	//DeleteJob,
	EditJob,
	Error,
	HomeLayout,
	Landing,
	Login,
	Profile,
	Register,
	Stats,
} from './pages';
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { loader as loaderUser } from './pages/Dashboard';
import { action as sendJob } from './pages/AddJob'; // send job
import { loader as loadAllJobs } from './pages/AllJobs';

import { action as sendEditJob } from './pages/EditJob'; // send job
import { loader as loadEditJobs } from './pages/EditJob';
import { action as DeleteJobAction } from './pages/DeleteJob';
import { loader as adminLoader } from './pages/Admin';
import { loader as infoLoad } from './pages/Stats';

import { action as UpdateJobAction } from './pages/Profile';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorElement from './components/ErrorElement';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 10,
		},
	},
});

export const checkDefaultTheme = () => {
	const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
	document.body.classList.toggle('dark-theme', isDarkTheme);
	return isDarkTheme;
};

checkDefaultTheme();

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		errorElement: <Error />,
		children: [
			{
				index: true,
				element: <Landing />,
			},
			{
				path: 'about',
				element: <div>About page</div>,
			},
			{
				path: 'landing',
				element: <Landing />,
			},
			{
				path: 'login',
				element: <Login />,
				action: loginAction(queryClient),
			},
			{
				path: 'register',
				element: <Register />,
				action: registerAction,
			},
			{
				path: 'dashboard',
				element: <Dashboard queryClient={queryClient} />,
				loader: loaderUser(queryClient),
				children: [
					{
						index: true,
						element: <AddJob />,
						action: sendJob(queryClient),
					},
					{
						path: 'stats',
						element: <Stats />,
						loader: infoLoad(queryClient),
						errorElement: <ErrorElement />,
					},
					{
						path: 'all-jobs',
						element: <AllJobs />,
						loader: loadAllJobs(queryClient),
						errorElement: <ErrorElement />,
					},
					{
						path: 'profile',
						element: <Profile />,
						action: UpdateJobAction(queryClient),
					},
					{
						path: 'admin',
						element: <Admin />,
						loader: adminLoader,
					},
					{
						path: 'edit-job/:id',
						element: <EditJob />,
						action: sendEditJob(queryClient),
						loader: loadEditJobs(queryClient),
					},
					{
						path: 'delete-job/:id',
						loader: DeleteJobAction(queryClient),
					},
				],
			},
		],
	},
]);

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
