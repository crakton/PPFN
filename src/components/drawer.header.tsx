import React, {useCallback, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {
	Image,
	ImageBackground,
	SafeAreaView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import FaIcon from "react-native-vector-icons/FontAwesome";
import FIcon from "react-native-vector-icons/Foundation";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {useDispatch, useSelector} from "react-redux";
import storage from "@react-native-firebase/storage";

import {style, styles} from "../constants/style";
import {INavigateProps} from "../interfaces";
import IClientData from "../interfaces/clientData";
import IProviderData from "../interfaces/providerData";
import {isSigned} from "../redux/auth/isSigned";
import {RootState} from "../types/redux.type";
import whichSignedUser from "../utils/whichSignedUser";
import firebaseServices from "../services/firebase.service";

export const DrawerHeader = () => {
	const {provider_data, client_data} = useSelector(
		(state: RootState) => state.userData,
	);
	const [whichUser, setWhichUser] = useState<{
		user: string | undefined;
		data: IClientData | IProviderData;
	}>();
	const [image, setImage] = useState<string>();
	const dispatch = useDispatch();
	const {reset, navigate} = useNavigation<{
		navigate: INavigateProps;
		reset: (state: {index: number; routes: {name: string}[]}) => void;
	}>();

	const handleLogout = useCallback(async () => {
		try {
			await AsyncStorage.setItem("is_signed", "no");
			const signedVal = await AsyncStorage.getItem("is_signed");
			dispatch(isSigned(signedVal));
			await AsyncStorage.multiRemove([
				"is_client",
				"is_provider",
				"list_provider",
				"previous_client_appointment",
				"upcoming_client_appointment",
				"user_data",
				"provider_data",
			]);
			setTimeout(() => {
				reset({index: 0, routes: [{name: "login"}]}), 100;
				firebaseServices.signOut();
			});
		} catch (error) {
			console.log(error);
		}
	}, [dispatch, reset]);
	useEffect(() => {
		(async () => {
			try {
				const user = await whichSignedUser();
				if (user === "client") {
					setWhichUser({data: client_data, user});
					const img = await storage()
						.ref(
							"profile_images/@" +
								client_data.id +
								client_data.first_name,
						)
						.getDownloadURL();
					setImage(img);
				} else {
					setWhichUser({data: provider_data, user});
					const img = await storage()
						.ref(
							"profile_images/@" +
								provider_data.id +
								provider_data.first_name,
						)
						.getDownloadURL();
					setImage(img);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [client_data, provider_data]);

	return (
		<SafeAreaView>
			<ImageBackground
				imageStyle={{resizeMode: "stretch"}}
				source={{
					uri: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzJ8fGhlYWx0aGNhcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
				}}>
				<View style={[styles.drawerHeaderAvatarContainer]}>
					<Image
						style={styles.drawerHeaderAvatar}
						source={
							image
								? {uri: image}
								: require("../assets/images/fallback.png")
						}
					/>
					<TouchableOpacity
						onPress={() => navigate("edit_profile")}
						style={styles.drawerHeaderEditIcon}>
						<FaIcon name="edit" color={style.highlight} size={12} />
					</TouchableOpacity>
				</View>
				<View style={styles.drawerHeaderInfoContainer}>
					<View>
						<Text style={[styles.drawerHeaderInfoText]}>
							{`${whichUser?.data.first_name} ${whichUser?.data.last_name}`}
						</Text>
						<TouchableWithoutFeedback>
							<Text
								style={{
									color: style.tertiaryColor,
									marginTop: -2,
								}}>
								<FIcon
									name="mail"
									color={style.tertiaryColor}
									size={12}
								/>
								{whichUser?.data.email}
							</Text>
						</TouchableWithoutFeedback>
					</View>
					<TouchableOpacity onPress={handleLogout}>
						<MCIcon
							name="logout-variant"
							size={24}
							color={style.secondaryColor}
						/>
						<Text style={{color: style.secondaryColor}}>
							Logout
						</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</SafeAreaView>
	);
};
