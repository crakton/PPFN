import React, {memo, useCallback, useMemo, useState} from "react";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {ScrollView} from "react-native-gesture-handler";
import {Alert, Text, TouchableOpacity, View} from "react-native";
import {Calendar, DateData} from "react-native-calendars";
import FoIcon from "react-native-vector-icons/Fontisto";
import {style} from "../../constants/style";
import {formatMonth} from "../../utils/formatMonth";
import Layout from "../../layouts/DrawerScreenLayout";
import {WIDTH} from "../../utils/dim";
import {appointment_shedules} from "../../constants/appointment_shedules";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../types/redux.type";
import axios from "axios";
import {appointment} from "../../apis/endpoints";
import IListProvider from "../../interfaces/listProvider";
import {INavigateProps} from "../../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getUpcomingClientAppointment} from "../../redux/appointments";
import {Toast} from "react-native-awesome";
import sendFcm from "../../apis/send-fcm";
import firebaseServices from "../../services/firebase.service";

export default memo(() => {
	const {navigate} = useNavigation<{navigate: INavigateProps}>();
	const {params} = useRoute<RouteProp<{params: IListProvider}>>();

	const [bookDates, setBookDates] = useState(new Set(""));
	const [selectedSchedule, setSelectedSchedule] = useState<number>();
	const handleSelectedSchedule = useCallback((val: number) => {
		setSelectedSchedule(val);
	}, []);

	const {client_data} = useSelector((state: RootState) => state.userData);
	const handleSelectedDates = useCallback(
		(date: DateData) => {
			const {dateString, day, month, year} = date;
			if (
				year >= new Date().getFullYear() &&
				month >= new Date().getMonth() + 1 &&
				day >= new Date().getDate()
			) {
				const newBookDates = new Set(bookDates);

				if (newBookDates.has(dateString)) {
					newBookDates.delete(dateString);
				} else {
					newBookDates.add(dateString);
				}
				setBookDates(newBookDates);
			} else if (month > new Date().getMonth() + 1) {
				const newBookDates = new Set(bookDates);

				if (newBookDates.has(dateString)) {
					newBookDates.delete(dateString);
				} else {
					newBookDates.add(dateString);
				}
				setBookDates(newBookDates);
			} else {
				Toast.showToast({
					message: "You can't set appointment in the past!",
					type: "warning",
					duration: 1000,
				});
			}
		},
		[bookDates],
	);

	const markedDates = useMemo(
		() =>
			[...bookDates].reduce((obj: any, item: string) => {
				obj[item] = {
					selected: true,
					marked: true,
					selectedColor: "#FE593D",
				};
				return obj;
			}, {}),
		[bookDates],
	);
	const dispatch = useDispatch();
	const handleAppointmentSubmission = useCallback(() => {
		if (selectedSchedule !== undefined && bookDates.size && params) {
			const popularity = Number(params.popularity) + 1;
			Alert.alert(
				"Confirm Appointment",
				"Are you sure you want to proceed with this appointment?",
				[
					{
						text: "confirm",
						onPress: async () => {
							try {
								setBookDates(new Set());
								setSelectedSchedule(undefined);
								const data = {
									prov_id: params.id,
									client_id: client_data.id,
									provider_name: `${params.first_name} ${params.last_name}`,
									client_name: `${client_data.first_name} ${client_data.last_name}`,
									facility: params.facility,
									client_contact: client_data.phone_number,
									service_name: "Immunization and Polio",
									price: "1200",
									discount: "",
									canceled: "N",
									service_booked: "Y",
									service_provided: "N",
									note_review: "",
									status: "Active",
									popularity,
								};

								const res = await axios.post(
									appointment,
									JSON.stringify(data),
									{
										headers: {
											Accept: "application/json",
											"Content-Type": "application/json",
										},
									},
								);
								if (res.status === 200) {
									let remotefmcuser: any =
										await firebaseServices.getUserDoc(
											`@${params.last_name}${params.id}`,
										);
									await sendFcm(
										remotefmcuser.fcm_token,
										`${client_data.first_name} ${client_data.last_name} just booked an appointment with you`,
										"New Appointment",
										{type: "APPOINTMENT"},
									);

									navigate("appointments");
									Toast.showToast({
										message:
											"Appointment successfully created!",
										type: "success",
										duration: 1000,
									});

									const upcoming = await axios.get(
										appointment.concat(
											`/beneficiary_upcoming?beneficiary_id=${client_data.id}`,
										),
									);
									await AsyncStorage.setItem(
										"upcoming_client_appoitment",
										JSON.stringify(upcoming.data),
									);
									const parsed = JSON.parse(
										await AsyncStorage.getItem(
											"upcoming_client_appoitment",
										),
									);
									dispatch(
										getUpcomingClientAppointment(parsed),
									);
								}
							} catch (error: any) {
								if (error === "Network Error") {
									Toast.showToast({
										message:
											"There is a problem with your network connection!",
									});
								} else if (error.response) {
									// Request made but the server responded with an error
									Toast.showToast({
										message: "Something went wrong!",
									});
								} else if (error.request) {
									// Request made but no response is received from the server.
									Toast.showToast({
										message:
											"Sorry, the problem is from us.",
									});
								} else {
									// Error occured while setting up the request
									Toast.showToast({
										message: "An error occured!",
									});
								}
								throw new Error("Error log: " + error);
							}
						},
					},
					{
						text: "cancel",
						onPress: () => {
							Toast.showToast({message: "Appointment canceled!"});
						},
					},
				],
			);
		} else {
			Toast.showToast({
				message: "Set an appointment!",
				type: "warning",
				duration: 2000,
			});
			if (params === undefined) {
				Toast.showToast({
					message: "Select a provider!",
					type: "warning",
					duration: 2000,
				});
				navigate("home");
			}
		}
	}, [
		bookDates.size,
		client_data.first_name,
		client_data.id,
		client_data.last_name,
		client_data.phone_number,
		dispatch,
		navigate,
		params,
		selectedSchedule,
	]);

	return (
		<Layout
			title={params ? `${params.first_name} ${params.last_name}` : ""}
			rating={params?.rating}>
			<ScrollView style={{flex: 1, paddingHorizontal: 15, marginTop: 10}}>
				<Calendar
					renderToHardwareTextureAndroid={true}
					onDayPress={handleSelectedDates}
					headerStyle={{
						backgroundColor: style.primaryColor,
					}}
					markedDates={markedDates}
					renderHeader={date => (
						<Text
							style={{
								fontSize: 18,
								fontWeight: "500",
								color: style.titleColor,
							}}>
							{formatMonth(date)}
						</Text>
					)}
					renderArrow={direction => (
						<>
							{direction === "left" && (
								<FoIcon
									color={style.titleColor}
									size={18}
									name="angle-left"
								/>
							)}
							{direction === "right" && (
								<FoIcon
									color={style.titleColor}
									size={18}
									name="angle-right"
								/>
							)}
						</>
					)}
				/>
				<View>
					<Text
						style={{
							padding: 10,
							color: style.primaryColor,
							fontSize: 16,
							fontWeight: "500",
						}}>
						Schedule
					</Text>
					<View style={{padding: 10}}>
						{appointment_shedules.map(({time, icon}, idx) => (
							<TouchableOpacity
								key={Math.random() * idx}
								onPress={() => handleSelectedSchedule(idx)}
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									marginVertical: 2,
									padding: 5,
									borderTopStartRadius: idx === 0 ? 10 : 0,
									borderTopEndRadius: idx === 0 ? 10 : 0,
									borderBottomStartRadius: idx === 3 ? 10 : 0,
									borderBottomEndRadius: idx === 3 ? 10 : 0,
									backgroundColor:
										selectedSchedule === idx
											? "#FE593D"
											: style.titleColor,
								}}>
								<Text
									style={{
										color:
											selectedSchedule === idx
												? style.cardColor
												: style.primaryColor,
									}}>
									{time}
								</Text>
								{icon(
									selectedSchedule === idx
										? "heart"
										: "heart-outline",
								)}
							</TouchableOpacity>
						))}
					</View>
					<View
						style={{
							justifyContent: "center",
							alignItems: "center",
							marginVertical: 10,
						}}>
						<TouchableOpacity
							onPress={handleAppointmentSubmission}
							style={{
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: style.primaryColor,
								padding: 10,
								borderRadius: 10,
								width: WIDTH / 1.5,
							}}>
							<Text
								style={{
									color: style.titleColor,
									fontWeight: "500",
									fontSize: 16,
								}}>
								Make an Appointment
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</Layout>
	);
});
