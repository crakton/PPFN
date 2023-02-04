import React, {useCallback, useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import Layout from "../../layouts/ProfileLayout";
import {style} from "../../constants/style";
import IClientData from "../../interfaces/clientData";
import IProviderData from "../../interfaces/providerData";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux.type";
import whichSignedUser from "../../utils/whichSignedUser";
import UpdateClientProfile from "./UpdateClientProfile";
import Icon from "react-native-vector-icons/AntDesign";
// import {
// 	ImagePickerResponse,
// launchCamera,
// 	launchImageLibrary,
// } from 'react-native-image-picker';
import UpdateProviderProfile from "./UpdateProviderProfile";
import {
	isCancel,
	isInProgress,
	pickSingle,
	types,
} from "react-native-document-picker";
import ActivityLoader from "../../components/widgets/ActivityLoader";
import {Toast} from "react-native-awesome";

function EditProfile({navigation: {goBack}}: {navigation: {goBack: Function}}) {
	const {client_data, provider_data} = useSelector(
		(state: RootState) => state.userData,
	);
	const [user, setUser] = useState<{
		data: IClientData | IProviderData | undefined;
		user: string;
	}>({data: undefined, user: ""});
	useEffect(() => {
		(async () => {
			const user = await whichSignedUser();
			setUser(
				user === "client"
					? {data: client_data, user}
					: {data: provider_data, user},
			);
		})();
	}, [client_data, provider_data]);

	const [profileImg, setProfileImg] = useState<string>();
	const handleProfileImgSelection = useCallback(async () => {
		try {
			const image = await pickSingle({
				type: types.images,
				copyTo: "documentDirectory",
				allowMultiSelection: false,
				mode: "import",
			});

			if (image.size > Math.pow(10, 5)) {
				Toast.showToast({
					message: "Please use image lesser than 1MB",
					type: "warning",
					duration: 2000,
				});
			} else {
				/* ImgToBase64.getBase64String(image.uri).then((base64String: string) => {
					console.log(base64String);

					setProfileImg(base64String);
				}); */
				setProfileImg(image.uri);
			}
		} catch (e) {
			if (isCancel(e)) {
				Toast.showToast({message: "Operation denied"});
				// User cancelled the picker, exit any dialogs or menus and move on
			} else if (isInProgress(e)) {
				console.warn(
					"multiple pickers were opened, only the last will be considered",
				);
			} else {
				throw e;
			}
		}
	}, []);
	if (!user.user) {
		return <ActivityLoader />;
	}

	return (
		<Layout
			profileImage={
				profileImg
					? profileImg
					: user.data?.photo_name
					? user.data.photo_name.replace("/image:", "/image%3A")
					: ""
			}
			profileImageBtn={
				<TouchableOpacity
					onPress={handleProfileImgSelection}
					style={{
						flexDirection: "row",
						alignItems: "center",
						position: "relative",
						padding: 10,
						backgroundColor: style.titleColor,
						marginRight: 10,
						borderRadius: 5,
					}}>
					<Icon size={20} color={style.primaryColor} name="camera" />
					<Text
						style={{
							color: style.primaryColor,
							fontFamily: "AltonaSans-Regular",
							fontSize: 18,
							fontWeight: "500",
						}}>
						{" "}
						EDIT
					</Text>
				</TouchableOpacity>
			}
			edit={true}
			showRegisteredDateAndName={true}
			userName={`${user?.data.first_name} ${user?.data.last_name}`}
			registeredDate={user?.data.address}
			backBtn={true}
			goBack={goBack}>
			{user.user === "client" ? (
				<UpdateClientProfile profileImage={profileImg} />
			) : (
				<UpdateProviderProfile profileImage={profileImg} />
			)}
		</Layout>
	);
}

export const styles = StyleSheet.create({
	input: {
		marginTop: 10,
		marginBottom: 10,
		borderBottomWidth: 1.5,
		borderColor: style.primaryColor,
		color: style.primaryColor,
		padding: 10,
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
	},
	updateBtn: {
		padding: 10,
		marginVertical: 20,
		backgroundColor: style.highlight,
		borderRadius: 50,
		elevation: 12,
	},
	updateText: {
		color: style.tertiaryColor,
		textAlign: "center",
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
	},
});
export default EditProfile;
