import {useRoute} from "@react-navigation/native";
import React, {memo, useEffect, useState} from "react";
import {
	KeyboardAvoidingView,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {Toast} from "react-native-awesome";
import {HeaderWithBackButton} from "../components/HeaderWithBackButton";
import {style} from "../constants/style";
import IListAppointment from "../interfaces/listAppointment";
import whichSignedUser from "../utils/whichSignedUser";
import formatDate from "./auth/formatDate";

function ViewAppointment() {
	const {params}: {params: IListAppointment} = useRoute();
	const [whichUser, setWhichUser] = useState<string>();
	useEffect(() => {
		(async () => {
			setWhichUser(await whichSignedUser());
		})();
	}, []);
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
							placeholder="Note"
							multiline
							style={{
								height: 120,
								borderWidth: 1.5,
								borderColor: style.primaryColor,
								borderRadius: 15,
								marginBottom: 10,
							}}
						/>
						<TouchableOpacity
							onPress={() =>
								Toast.showToast({
									message: "Not supported by API",
								})
							}
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
