import {Picker} from "@react-native-community/picker";
import {ItemValue} from "@react-native-community/picker/typings/Picker";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import React, {memo, useCallback, useEffect, useState} from "react";
import {
	Alert,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {Toast} from "react-native-awesome";
import {
	DocumentPickerResponse,
	isCancel,
	pickSingle,
	types,
} from "react-native-document-picker";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import AntIcon from "react-native-vector-icons/AntDesign";
import {useSelector} from "react-redux";
import sendFcm from "../apis/send-fcm";
import {services} from "../constants/services";

import {style} from "../constants/style";
import {INavigateProps} from "../interfaces";
import IClientData from "../interfaces/clientData";
import IListAppointment from "../interfaces/listAppointment";
import firebaseServices from "../services/firebase.service";
import {RootState} from "../types/redux.type";
import {WIDTH} from "../utils/dim";
import {Dropdown} from "./Dropdown";

const UploadReport = () => {
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const [uploadFile, setUploadFile] =
		React.useState<DocumentPickerResponse | null>(null);
	const [appointments, setAppointments] = useState<IListAppointment[]>([]);
	const [appointmentID, setAppointmentID] = useState<ItemValue>("");
	const [appointmentData, setAppointmentData] = useState<IListAppointment>();
	const [client, setClient] = useState<IClientData>();
	// const [service, setService] = useState<ItemValue>("");

	const {navigate} = useNavigation<{navigate: INavigateProps}>();

	//get providers appointments
	useEffect(() => {
		(async () => {
			const appmts = await (
				await axios(
					`https://ppfnhealthapp.com/api/appointment/provider_upcoming?prov_id=${provider_data.id}`,
				)
			).data;
			setAppointments(appmts);
		})();
	}, []);

	//get specifice appointment datum on user appointmentID select
	useEffect(() => {
		axios
			.get(
				`https://ppfnhealthapp.com/api/appointment/single?id=${appointmentID}`,
			)
			.then(res => {
				setAppointmentData(res.data);
			})
			.catch(error => {
				console.log(error);
			});
	}, [appointmentID]);

	useEffect(() => {
		axios
			.get(
				`https://ppfnhealthapp.com/api/beneficiary/single?id=${appointmentData?.client_id}`,
			)
			.then(res => setClient(res.data))
			.catch(error => console.log(error));
	}, [appointmentData?.client_id]);

	console.log(client?.id);

	const handleOnSelectUpload = useCallback(async () => {
		try {
			const singleFile = await pickSingle({
				type: [types.doc, types.pdf, types.docx],
				presentationStyle: "fullScreen",
			});

			setUploadFile(singleFile);
			console.log("File selected Successfully!", singleFile);
		} catch (error) {
			//handle errors
			//if user cancels
			setUploadFile(null);
			if (isCancel(error)) {
				Alert.alert("File selection canceled");
			} else {
				Alert.alert("Something Happened!");
				throw error;
			}
		}
	}, []);

	const handleReportSubmit = useCallback(async () => {
		if (!appointmentData) {
			Toast.showToast({
				message: "select beneficiary",
				type: "warning",
				duration: 2000,
			});
			return;
		}
		let remotefmcuser: any = await firebaseServices.getUserDoc(
			`@${client?.last_name.split(" ").join("")}${client?.id}`,
		);
		// console.log("remote user fcm token: ", remotefmcuser.fcm_token);

		// console.log("prov_id", appointmentData.prov_id);
		// console.log("appointment_id", appointmentID);
		// console.log("client_id", appointmentData.client_id);
		// console.log(appointmentData.prov_id);

		try {
			const res = await axios.post(
				"https://ppfnhealthapp.com/api/report",
				`appointment_id=${appointmentID}&provider_id=${provider_data.id}&beneficiary_id=${client?.id}&status=sent&title=${appointmentData?.service_name}`,
				{
					headers: {
						Accept: "application/json",
					},
				},
			);
			if (res.status) {
				const fcm_res = await sendFcm(
					remotefmcuser.fcm_token,
					`${provider_data.first_name} ${provider_data.last_name} just sent a new report`,
					"Report",
					{type: "REPORT"},
				);

				Toast.showToast({
					message: "Report sent Successfully!",
					type: "success",
					duration: 2000,
				});

				navigate("reports");
			}
		} catch (error) {
			Toast.showToast({
				message: "Faild to upload report",
				type: "warning",
				duration: 2000,
			});
			console.log(JSON.stringify(error));
		}
	}, [provider_data.id, appointmentID, uploadFile]);

	const handleValue = useCallback((value: ItemValue) => {
		setAppointmentID(value);
	}, []);

	return (
		<SafeAreaView style={{paddingHorizontal: 15}}>
			<Text>Select Beneficiary</Text>
			<Picker onValueChange={handleValue} selectedValue={appointmentID}>
				{appointments?.map(appoint => (
					<Picker.Item
						key={appoint.id}
						value={appoint.id}
						label={appoint.client_name}
					/>
				))}
			</Picker>
			<Text style={styles.uploadTitle}>
				Appointment title: {`${appointmentData?.service_name}`}
			</Text>

			<TouchableWithoutFeedback
				onPress={handleOnSelectUpload}
				style={styles.selectContainer}>
				<Text style={styles.selectPlaceholder}>
					Attach File:{" "}
					<Text style={styles.selectPlaceholderText}>
						{uploadFile?.name}
					</Text>
				</Text>
			</TouchableWithoutFeedback>
			<View style={{justifyContent: "center", alignItems: "center"}}>
				<TouchableOpacity
					onPress={handleReportSubmit}
					style={{
						backgroundColor: style.primaryColor,
						justifyContent: "center",
						alignItems: "center",
						padding: 10,
						width: WIDTH / 1.5,
						borderRadius: 10,
						marginTop: 20,
					}}>
					<AntIcon name="upload" size={30} color={style.highlight} />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default memo(UploadReport);
const styles = StyleSheet.create({
	selectPlaceholder: {
		color: style.tertiaryColor,
		paddingHorizontal: 5,
	},
	selectPlaceholderText: {
		color: style.titleColor,
	},
	selectContainer: {
		borderBottomColor: style.tertiaryColor,
		borderBottomWidth: 1,
		padding: 10,
	},
	uploadTitle: {
		color: style.primaryColor,
		fontSize: 16,
	},
});
