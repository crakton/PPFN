/* eslint-disable no-spaced-func */
import AsyncStorage from "@react-native-async-storage/async-storage";
import database from "@react-native-firebase/database";
import {useNavigation} from "@react-navigation/native";
import React, {useCallback, useEffect, useState} from "react";
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
import {style, styles} from "../constants/style";
import {INavigateProps} from "../interfaces";
import IClientData from "../interfaces/clientData";
import IProviderData from "../interfaces/providerData";
import {isSigned} from "../redux/auth/isSigned";
import firebaseServices from "../services/firebase.service";
import {RootState} from "../types/redux.type";
import whichSignedUser from "../utils/whichSignedUser";

export const DrawerHeader = () => {
	const {provider_data, client_data} = useSelector(
		(state: RootState) => state.userData,
	);
	const [whichUser, setWhichUser] = useState<{
		user: string | undefined;
		data: IClientData | IProviderData;
	}>();
	const dispatch = useDispatch();
	const {reset, navigate} = useNavigation<{
		navigate: INavigateProps;
		reset: (state: {index: number; routes: {name: string}[]}) => void;
	}>();
	const handleLogout = useCallback(async () => {
		try {
			database()
				.ref(`Users/@${whichUser?.data.last_name}${whichUser?.data.id}`)
				.update({online: false})
				.then(() => console.log("user offline!"));
			firebaseServices.signOut();
			// firebaseServices.setOnlineStatus(
			// 	`@${whichUser?.data.last_name}${whichUser?.data.id}`,
			// );
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
			]);
			setTimeout(() => reset({index: 0, routes: [{name: "login"}]}), 100);
		} catch (error: any) {
			console.log(error);
		}
	}, [dispatch, reset, whichUser?.data, whichSignedUser]);
	useEffect(() => {
		(async () => {
			try {
				const user = await whichSignedUser();
				setWhichUser({
					user,
					data: user === "client" ? client_data : provider_data,
				});
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
						source={require("../assets/images/fallback.png")}
					/>
					<TouchableOpacity
						onPress={() => navigate("edit_profile")}
						style={styles.drawerHeaderEditIcon}>
						<FaIcon name="edit" color={style.highlight} size={12} />
					</TouchableOpacity>
				</View>
				<View style={styles.drawerHeaderInfoContainer}>
					<View>
						<Text
							style={[
								styles.drawerHeaderInfoText,
							]}>{`${whichUser?.data.first_name} ${whichUser?.data.last_name}`}</Text>
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
