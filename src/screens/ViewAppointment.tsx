import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation, useRoute} from "@react-navigation/native";
import axios from "axios";
import React, {memo, useCallback, useEffect, useState} from "react";
import {
	KeyboardAvoidingView,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {Toast} from "react-native-awesome";
import {useDispatch} from "react-redux";
import {HeaderWithBackButton} from "../components/HeaderWithBackButton";
import {style} from "../constants/style";
import {INavigateProps} from "../interfaces";
import IListAppointment from "../interfaces/listAppointment";
import {
	getPreviousProviderAppointment,
	getUpcomingProviderAppointment,
} from "../redux/appointments";
import whichSignedUser from "../utils/whichSignedUser";
import formatDate from "./auth/formatDate";

function ViewAppointment() {
	const {navigate} = useNavigation<{navigate: INavigateProps}>();
	const {params}: {params: IListAppointment} = useRoute();
	const [notes, setNotes] = useState("");

	const dispatch = useDispatch();
	const [whichUser, setWhichUser] = useState<string>();
	useEffect(() => {
		(async () => {
			setWhichUser(await whichSignedUser());
		})();
	}, []);

	const handleAppointmentUpdate = useCallback(async () => {
		if (params.service_provided === "Y") {
			setNotes("");
			return;
		}
		try {
			const updateAppointment = {
				...params,
				service_provided: "Y",
				status: "Finished",
				note_review: notes.trim(),
			};
			const response = await axios.put(
				`https://ppfnhealthapp.com/api/appointment/${params.id}`,
				updateAppointment,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			if (response.status === 200) {
				await AsyncStorage.setItem(
					"upcoming_provider_appointment",
					await axios(
						`https://ppfnhealthapp.com/api/appointment/provider_upcoming?prov_id=${params.prov_id}`,
					).then(res => JSON.stringify(res.data)),
				);
				await AsyncStorage.setItem(
					"previous_provider_appointment",
					await axios(
						`https://ppfnhealthapp.com/api/appointment/provider_previous?prov_id=${params.prov_id}`,
					).then(res => JSON.stringify(res.data)),
				);
				const upcoming = JSON.parse(
					await AsyncStorage.getItem("upcoming_provider_appointment"),
				);
				const previous = JSON.parse(
					await AsyncStorage.getItem("previous_provider_appointment"),
				);

				dispatch(getUpcomingProviderAppointment(upcoming));
				dispatch(getPreviousProviderAppointment(previous));

				Toast.showToast({
					message: "Appointment successfully updated!",
					type: "success",
					duration: 1000,
				});
				navigate("appointments");
			}
		} catch (error) {
			console.log(error);
		}
	}, [dispatch, notes]);
	return (
		<SafeAreaView style={{flex: 1}}>
			<HeaderWithBackButton goback />
			<View>
				<View
					style={{
						marginVertical: 10,
						marginHorizontal: 20,
						padding: 10,
						backgroundColor: style.cardColor,
						borderRadius: 15,
						elevation: 8,
					}}>
					{/* <Text
						style={{
							color: style.primaryColor,
							fontFamily: 'AltonaSans-Regular',
							fontSize: 22,
							fontWeight: '500',
						}}
					>
						{params?.service_name}
					</Text> */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginVertical: 3,
						}}>
						<Text
							style={{
								color: style.primaryColor,
								flex: 1,
								backgroundColor: style.secondaryColor,
								borderRadius: 8,
								margin: 1,
								padding: 5,
								fontFamily: "AltonaSans-Regular",
								textAlign: "center",
							}}>
							Created: {formatDate(params?.date_created)}
						</Text>
						<Text
							style={{
								color: style.titleColor,
								flex: 1,
								backgroundColor: style.primaryColor,
								borderRadius: 8,
								margin: 1,
								padding: 5,
								fontFamily: "AltonaSans-Regular",
								textAlign: "center",
							}}>
							Starts: {formatDate(params?.date_created)}
						</Text>
						<Text
							style={{
								color: style.titleColor,
								flex: 1,
								backgroundColor: "#f59",
								borderRadius: 8,
								margin: 2,
								padding: 5,
								fontFamily: "AltonaSans-Regular",
								textAlign: "center",
							}}>
							Ends: {formatDate(params?.date_created)}
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							padding: 10,
						}}>
						<Text
							style={{
								fontFamily: "AltonaSans-Regular",
								fontSize: 16,
								color: style.primaryColor,
								width: 85,
							}}>
							Status
						</Text>
						<Text
							style={{
								color: style.tertiaryColor,
								fontFamily: "AltonaSans-Regular",
								fontSize: 16,
								fontWeight: "500",
							}}>
							{params.status}
						</Text>
					</View>
					{/* <Text
						style={{
							color: style.primaryColor,
							fontFamily: "AltonaSans-Regular",
							fontSize: 20,
							fontWeight: "500",
						}}>
						Facility
					</Text>
					<Text
						style={{
							fontFamily: "AltonaSans-Italic",
							fontSize: 16,
							color: style.titleColor,
						}}>
						{params.facility}
					</Text> */}
				</View>
				<View style={{marginVertical: 10, marginHorizontal: 20}}>
					<Text
						style={{
							color: style.primaryColor,
							fontFamily: "AltonaSans-Regular",
							fontSize: 18,
						}}>
						Beneficiary Name: {params?.client_name}
					</Text>
					<Text
						style={{
							color: style.primaryColor,
							fontFamily: "AltonaSans-Regular",
							fontSize: 18,
						}}>
						Beneficiary Contact: {params?.client_contact}
					</Text>
					<Text
						style={{
							color: style.primaryColor,
							fontFamily: "AltonaSans-Regular",
							fontSize: 18,
						}}>
						Provider: {params?.provider_name}
					</Text>
					<Text
						style={{
							color: style.primaryColor,
							fontFamily: "AltonaSans-Regular",
							fontSize: 18,
						}}>
						Cancellation reason:{" "}
						{params?.cancellation_reason
							? params.cancellation_reason
							: "N/A"}
					</Text>
					{params.note_review ? (
						<Text
							style={{
								color: style.primaryColor,
								fontFamily: "AltonaSans-Regular",
								fontSize: 18,
							}}>
							{params?.note_review}
						</Text>
					) : null}
				</View>
				{whichUser !== "client" ? (
					<KeyboardAvoidingView
						style={{
							marginHorizontal: 15,
						}}>
						<TextInput
							onChangeText={val => setNotes(val)}
							value={
								params.service_provided === "Y"
									? params.note_review
									: notes
							}
							placeholder="Note"
							multiline
							style={{
								height: 120,
								borderWidth: 1.5,
								borderColor: style.primaryColor,
								borderRadius: 15,
								marginBottom: 10,
								paddingHorizontal: 12,
							}}
						/>
						<TouchableOpacity
							disabled={
								params.service_provided === "Y" ? true : false
							}
							onPress={handleAppointmentUpdate}
							style={{
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 15,
								padding: 10,
								backgroundColor: style.secondaryColor,
								elevation: 10,
							}}>
							<Text
								style={{
									color: style.primaryColor,
									fontFamily: "AltonaSans-Regular",
									fontSize: 16,
								}}>
								Done
							</Text>
						</TouchableOpacity>
					</KeyboardAvoidingView>
				) : null}
			</View>
		</SafeAreaView>
	);
}

export default memo(ViewAppointment);
