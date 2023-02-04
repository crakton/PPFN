import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import React, {memo, useEffect, useState} from "react";
import {FlatList, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";

//components
import SetFetchType from "../../components/SetFetchType";
import ActivityLoader from "../../components/widgets/ActivityLoader";
import DefaultText from "../../components/widgets/DefaultText";
import {appointmentsFetchTypes} from "../../constants/staticMenus";
import {INavigateProps} from "../../interfaces";
import Layout from "../../layouts/DrawerScreenLayout";
import {
	getPreviousProviderAppointment,
	getUpcomingProviderAppointment,
} from "../../redux/appointments";
import {RootState} from "../../types/redux.type";
import {RenderAppointments} from "./appointment.screen";

const ProviderHome = () => {
	const dispatch = useDispatch();
	const {navigate} = useNavigation<{navigate: INavigateProps}>();

	const {previous_provider_appointment, upcoming_provider_appointment} =
		useSelector((state: RootState) => state.appointments);
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const [fetchType, setFetchType] = useState(appointmentsFetchTypes[0]);
	useEffect(() => {
		(async () => {
			try {
				await AsyncStorage.setItem(
					"upcoming_provider_appointment",
					await axios(
						`https://ppfnhealthapp.com/api/appointment/provider_upcoming?prov_id=${provider_data.id}`,
					).then(res => JSON.stringify(res.data)),
				);
				await AsyncStorage.setItem(
					"previous_provider_appointment",
					await axios(
						`https://ppfnhealthapp.com/api/appointment/provider_previous?prov_id=${provider_data.id}`,
					).then(res => JSON.stringify(res.data)),
				);
				const upcoming = await AsyncStorage.getItem(
					"upcoming_provider_appointment",
				);
				const previous = await AsyncStorage.getItem(
					"previous_provider_appointment",
				);

				dispatch(getUpcomingProviderAppointment(JSON.parse(upcoming)));
				dispatch(getPreviousProviderAppointment(JSON.parse(previous)));
			} catch (error: any) {
				if (error.message === "Network Error") {
					Toast("Network Error");
				}
				throw new Error(JSON.stringify(error));
			}
		})();
	}, [dispatch, provider_data]);
	if (!provider_data.id) {
		return <ActivityLoader />;
	}

	return (
		<Layout
			title={`Hello ${provider_data.first_name}.`}
			subtitle="Find your upcoming and previous appointments here.">
			<View style={{paddingHorizontal: 15}}>
				<SetFetchType
					fetchTypes={appointmentsFetchTypes}
					activeFetchType={fetchType}
					setFetchType={setFetchType}
				/>
			</View>
			{fetchType === "Upcoming" ? (
				upcoming_provider_appointment.length ? (
					<FlatList
						data={upcoming_provider_appointment}
						keyExtractor={(_, id) => id.toString()}
						renderItem={({item}) =>
							RenderAppointments({
								item,
								navigate,
								providerphone: provider_data.phone_number,
							})
						}
					/>
				) : (
					<DefaultText
						text={"You do not have any upcoming appointment yet!"}
					/>
				)
			) : null}
			{fetchType === "Previous" ? (
				previous_provider_appointment.length ? (
					<FlatList
						data={previous_provider_appointment}
						keyExtractor={(_, id) => id.toString()}
						renderItem={({item}) =>
							RenderAppointments({
								item,
								navigate,
								providerphone: provider_data.phone_number,
							})
						}
					/>
				) : (
					<DefaultText text="You do not have any previous appointment." />
				)
			) : null}
		</Layout>
	);
};

export default memo(ProviderHome);
