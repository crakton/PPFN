import {Picker} from "@react-native-community/picker";
import {ItemValue} from "@react-native-community/picker/typings/Picker";
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
import {services} from "../constants/services";

import {style} from "../constants/style";
import IListAppointment from "../interfaces/listAppointment";
import {RootState} from "../types/redux.type";
import {WIDTH} from "../utils/dim";
import {Dropdown} from "./Dropdown";

const UploadReport = () => {
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const [uploadFile, setUploadFile] =
		React.useState<DocumentPickerResponse | null>(null);
	const [appointments, setAppointments] = useState<IListAppointment[]>([]);
	const [selectAppointment, setSelectedAppointment] = useState<ItemValue>("");
	const [appoinmentName, setAppointmentName] = useState<IListAppointment>();
	const [service, setService] = useState<ItemValue>("");
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
		try {
			const form = new FormData();
			form.append("appointment_id", selectAppointment);
			form.append("status", "sent");
			form.append("provider_id", provider_data.id);
			form.append("title", appoinmentName?.service_name);
			const res = await axios(`https://ppfnhealthapp.com/api/report`, {
				method: "POST",
				headers: {
					"Content-Type": "multipart/formdata",
					Accept: "application/json",
				},
				data: `appointment_id=${selectAppointment}&provider_id=${provider_data.id}&status=sent&title=${appoinmentName?.service_name}`,
			});
			if (res.status) {
				Toast.showToast({
					message: "Report sent Successfully!",
					type: "success",
					duration: 2000,
				});
			}
		} catch (error) {
			Toast.showToast({
				message: "Faild to upload report",
				type: "warning",
				duration: 2000,
			});
			console.log(JSON.stringify(error));
		}
	}, [provider_data.id, selectAppointment, uploadFile]);

	const handleValue = useCallback((value: ItemValue) => {
		setSelectedAppointment(value);
	}, []);
	/* 	const handleService = useCallback((value: ItemValue) => {
		setService(value);
	}, []); */

	useEffect(() => {
		axios
			.get(
				`https://ppfnhealthapp.com/api/appointment/single?id=${selectAppointment}`,
			)
			.then(res => {
				setAppointmentName(res.data);
			})
			.catch(error => {
				console.log(error);
			});
	}, [selectAppointment]);

	return (
		<SafeAreaView style={{paddingHorizontal: 15}}>
			{/* <Text style={styles.uploadTitle}>Update Report</Text>
			<Dropdown
			title="Services"
			data={services}
			onChange={handleService}
			selectedValue={service}
		/> */}

			<Text>Select Beneficiary</Text>
			<Picker
				onValueChange={handleValue}
				selectedValue={selectAppointment}>
				{appointments?.map(appoint => (
					<Picker.Item
						key={appoint.id}
						value={appoint.id}
						label={appoint.client_name}
					/>
				))}
			</Picker>
			<Text style={styles.uploadTitle}>
				Appointment title: {`${appoinmentName?.service_name}`}
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
