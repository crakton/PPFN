import React, {useCallback, useEffect, useMemo, useState} from "react";
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
import UpdateProviderProfile from "./UpdateProviderProfile";
import {Toast} from "react-native-awesome";
import {
	DocumentPickerResponse,
	isCancel,
	isInProgress,
	pickSingle,
	types,
} from "react-native-document-picker";
import storage from "@react-native-firebase/storage";
import ActivityLoader from "../../components/widgets/ActivityLoader";
import {launchImageLibrary} from "react-native-image-picker";

function EditProfile({navigation: {goBack}}: {navigation: {goBack: Function}}) {
	const {client_data, provider_data} = useSelector(
		(state: RootState) => state.userData,
	);
	const [user, setUser] = useState<{
		data: IClientData | IProviderData | undefined;
		user: string;
	}>({data: undefined, user: ""});
	const [image, setImage] = useState<string>();

	useEffect(() => {
		(async () => {
			const user = await whichSignedUser();
			if (user === "client") {
				setUser({data: client_data, user});
				const img = await storage()
					.ref(
						"profile_images/@" +
							client_data.id +
							client_data.first_name,
					)
					.getDownloadURL();
				setImage(img);
			} else {
				setUser({data: provider_data, user});
				const img = await storage()
					.ref(
						"profile_images/@" +
							provider_data.id +
							provider_data.first_name,
					)
					.getDownloadURL();
				setImage(img);
			}
		})();
	}, [client_data, provider_data]);

	const [profileImg, setProfileImg] = useState<string>();
	// const [profileImg, setProfileImg] = useState<DocumentPickerResponse>();
	const handleProfileImgSelection = useCallback(async () => {
		// try {
		// 	const image = await pickSingle({
		// 		type: types.images,
		// 		copyTo: "documentDirectory",
		// 		allowMultiSelection: false,
		// 		mode: "import",
		// 	});

		// 	if (image.size > Math.pow(10, 5)) {
		// 		Toast.showToast({
		// 			message: "Please use image lesser than 1MB",
		// 			type: "warning",
		// 			duration: 2000,
		// 		});
		// 	} else {
		// 		/* ImgToBase64.getBase64String(image.uri).then((base64String: string) => {
		// 			console.log(base64String);

		// 			setProfileImg(base64String);
		// 		}); */
		// 		setProfileImg(image.uri);
		// 	}
		// } catch (e) {
		// 	if (isCancel(e)) {
		// 		Toast.showToast({message: "Operation denied"});
		// 		// User cancelled the picker, exit any dialogs or menus and move on
		// 	} else if (isInProgress(e)) {
		// 		console.warn(
		// 			"multiple pickers were opened, only the last will be considered",
		// 		);
		// 	} else {
		// 		throw e;
		// 	}
		// }
		try {
			const image = await launchImageLibrary({
				selectionLimit: 1,
				mediaType: "photo",
			});
			if (image.didCancel) {
				Toast.showToast({
					message: "Operation cancelled!",
					type: "warning",
				});
			} else if (image.errorCode) {
				Toast.showToast({
					message: "Something happened!",
					type: "danger",
				});
			} else if (image.assets[0].fileSize > 700000) {
				Toast.showToast({
					message: "File size is larger than 500KB",
					type: "warning",
				});
			} else {
				setProfileImg(image.assets[0]?.uri);
			}
		} catch (error) {
			console.log(error);
		}
	}, []);
	if (!user.user) {
		return <ActivityLoader />;
	}

	return (
		<Layout
			profileImage={profileImg ?? image}
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
			userName={`${user?.data?.first_name} ${user?.data?.last_name}`}
			registeredDate={user?.data?.address}
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
