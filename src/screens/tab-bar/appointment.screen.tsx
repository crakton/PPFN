import React, {memo, useEffect, useState} from "react";
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import AntIcon from "react-native-vector-icons/AntDesign";

//components
import SetFetchType from "../../components/SetFetchType";
import Layout from "../../layouts/DrawerScreenLayout";

//constants, interfaces and utils
import {appointmentsFetchTypes} from "../../constants/staticMenus";
import whichSignedUser from "../../utils/whichSignedUser";
import IClientData from "../../interfaces/clientData";
import IProviderData from "../../interfaces/providerData";
import {style} from "../../constants/style";
import {RootState} from "../../types/redux.type";
import IListAppointment from "../../interfaces/listAppointment";
import formatDate from "../auth/formatDate";
import DefaultText from "../../components/widgets/DefaultText";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ActivityLoader from "../../components/widgets/ActivityLoader";
import axios from "axios";
import {
	getPreviousClientAppointment,
	getPreviousProviderAppointment,
	getUpcomingClientAppointment,
	getUpcomingProviderAppointment,
} from "../../redux/appointments";
import {useNavigation} from "@react-navigation/native";
import {INavigateProps} from "../../interfaces";
import Home from "./home.screen";
import generateToken from "../../apis/generate-token";
import callService from "../../services/call.service";
import sendFcm from "../../apis/send-fcm";
import firebaseServices from "../../services/firebase.service";

export function RenderAppointments(props: {
	item: IListAppointment;
	navigate: INavigateProps;
	providerphone?: string;
}) {
	const {item, navigate} = props;
	const channel = item.provider_name
		.split(" ")
		.splice(0, 1)
		.concat(item.client_name.split(" ").slice(1))
		.join("_")
		.toString();

	async function handleCall() {
		const user = await whichSignedUser();

		console.log(channel);

		if (user === "client") {
			// const token = await generateToken(channel, item.client_id);
			const lastname = item.provider_name.split(" ").slice(1).join("");
			let remotefmcuser: any = await firebaseServices.getUserDoc(
				`@${lastname}${item.prov_id}`,
			);
			await sendFcm(
				remotefmcuser.fcm_token,
				`${item.client_name} starting a call`,
				"Calling",
				{
					type: "CALL",
					channel,
					caller: item.client_name,
					username: item.provider_name,
					uid: item.prov_id,
				},
			);

			navigate("call", {
				channel,
				uid: item.client_id,
				username: item.client_name,
			});
		} else if (user === "provider") {
			// const token = await generateToken(channel, item.prov_id);
			// console.log(token);

			const lastname = item.client_name.split(" ").slice(1).join("");
			console.log(lastname, "user");

			let remotefmcuser: any = await firebaseServices.getUserDoc(
				`@${lastname}${item.client_id}`,
			);
			await sendFcm(
				remotefmcuser.fcm_token,
				`${item.provider_name} starting a call`,
				"Calling",
				{
					type: "CALL",
					channel,
					caller: item.provider_name,
					username: item.client_name,
					uid: item.client_id,
				},
			);

			navigate("call", {
				channel,
				uid: item.prov_id,
				username: item.provider_name,
			});
		}

		// navigate("call");
	}

	return (
		<View style={styles.container}>
			<View style={styles.imgContainer}>
				<Image
					style={styles.img}
					source={require("../../assets/images/logo.png")}
				/>
			</View>
			<View style={{flex: 1, flexDirection: "column"}}>
				<Text
					style={{
						fontFamily: "AltonaSans-Regular",
						fontSize: 18,
						fontWeight: "500",
						textTransform: "capitalize",
						color: style.primaryColor,
					}}>
					{item.provider_name} | {item.client_name}
				</Text>

				<Text
					style={{
						fontSize: 12,
						fontWeight: "500",
						color: style.titleColor,
					}}>
					{formatDate(item.date_created)}
				</Text>
				{item.facility && (
					<View style={{flexDirection: "row", marginVertical: 5}}>
						<Text style={styles.clinic}>{item.facility}</Text>
					</View>
				)}
			</View>
			{/* <View style={{justifyContent: 'center', paddingHorizontal: 5}}>
				{item.status === 'Active' ? (
					<View style={[styles.status, styles.active]} />
				) : (
					<View style={[styles.status, styles.inactive]} />
				)}
			</View> */}
			<View style={{flexDirection: "column"}}>
				<TouchableOpacity
					onPress={() => navigate("view_appointment", item)}
					style={styles.secondaryBtn}>
					<AntIcon
						color={style.highlight}
						size={30}
						name="calendar"
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleCall}
					style={styles.primaryBtn}>
					<AntIcon color={style.highlight} size={30} name="phone" />
				</TouchableOpacity>
			</View>
		</View>
	);
}
const Appointment = memo(() => {
	const {navigate} = useNavigation<{navigate: INavigateProps}>();
	const {client_data, provider_data} = useSelector(
		(state: RootState) => state.userData,
	);
	const {previous_client_appointment, upcoming_client_appointment} =
		useSelector((state: RootState) => state.appointments);
	const [whichUser, setWhichUser] = useState<{
		user: string;
		data: IClientData | IProviderData;
	}>();
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			const user = await whichSignedUser();
			setWhichUser({
				user,
				data: user === "client" ? client_data : provider_data,
			});
			if (whichUser?.user === "client") {
				await getClientAppointments();
			} else {
				await getProviderAppointments();
			}
			async function getClientAppointments() {
				try {
					const resUp = await axios(
						`https://ppfnhealthapp.com/api/appointment/beneficiary_upcoming?beneficiary_id=${client_data.id}`,
					);
					await AsyncStorage.setItem(
						"upcoming_client_appointment",
						JSON.stringify(resUp.data),
					);
					const resPre = await axios(
						`https://ppfnhealthapp.com/api/appointment/beneficiary_previous?beneficiary_id=${client_data.id}`,
					);
					await AsyncStorage.setItem(
						"previous_client_appointment",
						JSON.stringify(resPre.data),
					);
					const upcoming = JSON.parse(
						await AsyncStorage.getItem(
							"upcoming_client_appointment",
						),
					);
					const previous = JSON.parse(
						await AsyncStorage.getItem(
							"previous_client_appointment",
						),
					);
					dispatch(getUpcomingClientAppointment(upcoming));
					dispatch(getPreviousClientAppointment(previous));
				} catch (error) {
					if (error.message === "Network Error") {
						Toast("Network Error");
					}
					throw new Error(JSON.stringify(error));
				}
			}
			async function getProviderAppointments() {
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
					const upcoming = JSON.parse(
						await AsyncStorage.getItem(
							"upcoming_provider_appointment",
						),
					);
					const previous = JSON.parse(
						await AsyncStorage.getItem(
							"previous_provider_appointment",
						),
					);

					dispatch(getUpcomingProviderAppointment(upcoming));
					dispatch(getPreviousProviderAppointment(previous));
				} catch (error) {
					if (error.message === "Network Error") {
						Toast("Network Error");
					}
					throw new Error(JSON.stringify(error));
				}
			}
		})();
	}, [whichUser?.user, client_data, dispatch, provider_data]);
	const [fetchType, setFetchType] = useState(appointmentsFetchTypes[0]);

	if (!whichUser) {
		return <ActivityLoader />;
	}
	return whichUser.user === "provider" ? (
		<Home />
	) : (
		<Layout
			title={`Hello ${whichUser?.data.first_name}.`}
			subtitle="Find your upcoming and previous appointments here.">
			<View style={{paddingHorizontal: 15}}>
				<SetFetchType
					fetchTypes={appointmentsFetchTypes}
					activeFetchType={fetchType}
					setFetchType={setFetchType}
				/>
			</View>
			{fetchType === "Upcoming" ? (
				upcoming_client_appointment.length ? (
					<FlatList
						data={upcoming_client_appointment}
						keyExtractor={(_, id) => id.toString()}
						renderItem={({item}) =>
							RenderAppointments({item, navigate})
						}
					/>
				) : (
					<DefaultText
						text={"You do not have any upcoming appointment yet!"}
					/>
				)
			) : null}
			{fetchType === "Previous" ? (
				previous_client_appointment.length ? (
					<FlatList
						data={previous_client_appointment}
						keyExtractor={(_, id) => id.toString()}
						renderItem={({item}) =>
							RenderAppointments({item, navigate})
						}
					/>
				) : (
					<DefaultText text="You do not have any previous appointment." />
				)
			) : null}
		</Layout>
	);
});

export default Appointment;

const styles = StyleSheet.create({
	status: {
		padding: 5,
		borderRadius: 99,
	},
	active: {
		backgroundColor: "limegreen",
	},
	inactive: {
		backgroundColor: style.titleColor,
	},
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: style.cardColor,
		borderRadius: 15,
		overflow: "hidden",
		elevation: 3,
		marginVertical: 5,
		marginHorizontal: 15,
	},
	imgContainer: {
		height: 55,
		width: 55,
		overflow: "hidden",
		borderRadius: 100,
		marginVertical: 15,
		marginHorizontal: 10,
	},
	img: {
		width: 55,
		height: 55,
	},
	secondaryBtn: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.secondaryColor,
		paddingHorizontal: 15,
	},
	primaryBtn: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.tertiaryColor,
		paddingHorizontal: 15,
	},
	clinic: {
		fontSize: 12,
		fontWeight: "bold",
		color: style.secondaryColor,
		backgroundColor: style.highlight,
		flexDirection: "row",
		padding: 7,
		borderRadius: 5,
	},
});
