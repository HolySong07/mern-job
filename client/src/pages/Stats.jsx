import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

/* export const loader = async () => {
	try {
		const response = await customFetch.get('/jobs/stats');
		return response.data;
	} catch (error) {
		return error;
	}
}; */

const statsQuery = {
	queryKey: ['stats'],
	queryFn: async () => {
		const response = await customFetch.get('/jobs/stats');
		return response.data;
	},
};

export const loader = (queryClient) => async () => {
	const data = await queryClient.ensureQueryData(statsQuery);
	return data;
};

const Stats = () => {
	const { isLoading, isError, data } = useQuery(statsQuery);

	if (isLoading) return <h4>Loading...</h4>;
	if (isError) return <h4>Error...</h4>;

	const { defaultStats, monthlyApplications } = data;

	return (
		<>
			<StatsContainer defaultStats={defaultStats} />
			{monthlyApplications?.length > 1 && (
				<ChartsContainer data={monthlyApplications} />
			)}
		</>
	);
};
export default Stats;
