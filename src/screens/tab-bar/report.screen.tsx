import React, {memo, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StatusBar, Text, View} from 'react-native';
import ReportsDocListItem from '../../components/ReportsDocListItem';
import SetFetchType from '../../components/SetFetchType';
import Layout from '../../layouts/DrawerScreenLayout';
import {reportFetchTypes, reportFetchTypes2} from '../../constants/staticMenus';
import UploadReport from '../../components/UploadReport';
import whichSignedUser from '../../utils/whichSignedUser';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../types/redux.type';
import DefaultText from '../../components/widgets/DefaultText';
import axios from 'axios';
import ActivityLoader from '../../components/widgets/ActivityLoader';
import {style} from '../../constants/style';
import {updateReport} from '../../redux/reports';

const Report = memo(() => {
	const [whichUser, setWhichUser] = useState<string>('');

	useEffect(() => {
		(async () => {
			const user = await whichSignedUser();
			setWhichUser(user);
		})();
	}, []);
	if (!whichUser) {
		return <ActivityLoader />;
	}
	return whichUser === 'provider' ? <ProviderReport /> : <ClientReport />;
});

const ProviderReport = memo(() => {
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const [fetchType, setFetchType] = useState(reportFetchTypes2[0]);
	const reports = useSelector((state: RootState) => state.reports);
	const dispatch = useDispatch();
	useEffect(() => {
		(async () => {
			const res = await axios.get(
				`https://ppfnhealthapp.com/api/report?provider_id=${provider_data.id}`,
			);
			dispatch(updateReport(res.data));
			console.log('reports', res.data, provider_data.id);
		})();
	}, [dispatch, provider_data.id]);
	return (
		<SafeAreaView style={{flex: 1, marginTop: 20}}>
			<Text
				style={{
					color: style.primaryColor,
					fontFamily: 'AltonaSans-Regular',
					fontSize: 24,
					marginHorizontal: 15,
				}}>{`Hello ${provider_data.first_name}`}</Text>
			<Text
				style={{
					color: style.titleColor,
					fontFamily: 'AltonaSans-Regular',
					fontSize: 18,
					marginHorizontal: 15,
				}}>
				Upload and find previous reports here{' '}
			</Text>
			<View style={{paddingHorizontal: 15}}>
				<SetFetchType
					fetchTypes={reportFetchTypes2}
					activeFetchType={fetchType}
					setFetchType={setFetchType}
				/>
			</View>
			{fetchType === 'Sent' ? (
				reports.length ? (
					<FlatList
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{paddingHorizontal: 15}}
						data={reports}
						keyExtractor={(_, id) => id.toString()}
						renderItem={({item}) => (
							<View style={{marginVertical: 7}}>
								<ReportsDocListItem {...item} />
							</View>
						)}
					/>
				) : (
					<DefaultText text={'You do not have any reports yet.'} />
				)
			) : (
				<UploadReport />
			)}
		</SafeAreaView>
	);
});

const ClientReport = memo(() => {
	const {client_data} = useSelector((state: RootState) => state.userData);
	const [fetchType, setFetchType] = useState(reportFetchTypes[0]);
	const reports = useSelector((state: RootState) => state.reports);
	const dispatch = useDispatch();
	useEffect(() => {
		(async () => {
			const res = await axios.get(
				`https://ppfnhealthapp.com/api/report?beneficiary_id=${client_data.id}`,
			);
			dispatch(updateReport(res.data));
			console.log('reports', res.data, client_data.id);
		})();
	}, [dispatch, client_data.id]);
	return (
		<Layout
			title={`Hello ${client_data.first_name}!`}
			subtitle="Find your reports">
			<View style={{marginTop: 20, paddingHorizontal: 15}}>
				<SetFetchType
					fetchTypes={reportFetchTypes}
					activeFetchType={fetchType}
					setFetchType={setFetchType}
				/>
			</View>
			{fetchType === 'All' ? (
				reports.length ? (
					<FlatList
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{paddingHorizontal: 15}}
						data={reports}
						keyExtractor={(_, id) => id.toString()}
						renderItem={({item}) => (
							<View style={{marginVertical: 7}}>
								<ReportsDocListItem download {...item} />
							</View>
						)}
					/>
				) : (
					<DefaultText text={'You do not have any reports yet.'} />
				)
			) : null}
			{fetchType === 'New' ? (
				reports.length ? (
					<FlatList
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{paddingHorizontal: 15}}
						data={reports}
						keyExtractor={(_, id) => id.toString()}
						renderItem={({item}) => (
							<View style={{marginVertical: 7}}>
								<ReportsDocListItem download {...item} />
							</View>
						)}
					/>
				) : (
					<DefaultText text={'You do not have any reports yet.'} />
				)
			) : null}
		</Layout>
	);
});

export default Report;
