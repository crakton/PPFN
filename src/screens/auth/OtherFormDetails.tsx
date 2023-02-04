import React, {useCallback} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {
	Image,
	KeyboardAvoidingView,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import axios from "axios";
import FaIcon from "react-native-vector-icons/FontAwesome";
import KommunicateChat from "react-native-kommunicate-chat";
import {
	isCancel,
	DocumentPickerResponse,
	pickSingle,
	types,
	isInProgress,
} from "react-native-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Toast} from "react-native-awesome";
import {useDispatch} from "react-redux";

import {kommunicate_appid} from "@env";

//interfaces
//colors object
import {style} from "../../constants/style";

//apis
import nigeria_states from "../../constants/nigeria-states.json";
import {WIDTH} from "../../utils/dim";
import {client} from "../../apis/endpoints";
import {isSigned} from "../../redux/auth/isSigned";
import loginClient from "../../apis/client/loginClient";
import IClientData from "../../interfaces/clientData";
import {getClientData} from "../../redux/user/userData";
import {Dropdown} from "../../components/Dropdown";
import {ItemValue} from "@react-native-community/picker/typings/Picker";
export default function OtherFormDetails() {
	const {
		params,
	}: {
		params: {
			first_name: string;
			last_name: string;
			email: string;
			address: string;
			phone_number: string;
			gender: string;
			date_of_birth: string;
		};
	} = useRoute();
	const {
		reset,
	}: {
		reset: (state: {index: number; routes: {name: string}[]}) => void;
	} = useNavigation();
	const dispatch = useDispatch();
	const passRef = React.useRef<TextInput>(null);
	const confirmPassRef = React.useRef<TextInput>(null);
	const [password, setPassword] = React.useState<string>();
	const [confirmPassword, setConfirmPassword] = React.useState<string>();
	const [selectedState, setSelectedState] = React.useState<ItemValue>("");
	const [imageUri, setImageUri] =
		React.useState<DocumentPickerResponse | null>();
	const [hidePassword, setHidePassword] = React.useState<boolean>(true);

	const handleStateSelection = useCallback(
		(val: ItemValue) => setSelectedState(val),
		[],
	);
	const handleImageSelection = useCallback(async () => {
		try {
			const image = await pickSingle({
				type: types.images,
				copyTo: "cachesDirectory",
				allowMultiSelection: false,
				mode: "import",
			});

			if (image.size > Math.pow(10, 5)) {
				Toast.showToast({message: "Please use image lesser than 1MB"});
			} else {
				setImageUri(image);
			}
		} catch (e) {
			if (isCancel(e)) {
				Toast.showToast({message: "Operation cancelled"});
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
	const handleSignup = useCallback(async () => {
		if (!password) {
			Toast.showToast({message: "Password required!"});
			passRef.current?.focus();
			return;
		}
		if (password !== confirmPassword) {
			Toast.showToast({message: "Password does not match"});
			setPassword("");
			setConfirmPassword("");
			passRef.current?.focus();
			return;
		}
		if (password.length < 8) {
			Toast.showToast({
				message: "Password should be 8 characters length",
			});
			setPassword("");
			setConfirmPassword("");
			passRef.current?.focus();
			return;
		}
		// if (!imageUri) {
		// 	Toast.showToast({message: "Please provide a profile image"});
		// 	return;
		// }
		try {
			/**
			 * API Actions here
			 */
			let image;
			const res = await axios(client, {
				method: "POST",
				data: `first_name=${params.first_name}&last_name=${params.last_name}&email=${params.email}&phone_number=${params.phone_number}&date_of_birth=${params.date_of_birth}&gender=${params.gender}&address=${params.address}&hash=${password}&photo_name=${image}&state=${selectedState}`,
			});
			if (res.data.message === "success") {
				const signed = await AsyncStorage.getItem("is_signed");

				dispatch(isSigned(signed));
				const __ud__ = {
					email: params.email,
					hash: password,
				};

				const response_client = await loginClient(
					JSON.stringify(__ud__),
				);
				if (
					(response_client?.data.status !== false &&
						response_client?.data.status === null) ||
					response_client?.data.status === "Active"
				) {
					await AsyncStorage.multiSet([
						["is_signed", "yes"],
						["is_client", "yes"],
						["is_provider", "no"],
						["user_data", JSON.stringify(response_client?.data)],
					]);

					const user_data: IClientData = JSON.parse(
						await AsyncStorage.getItem("user_data"),
					);
					Toast.showToast({
						duration: 2000,
						message: "Account successfully created",
						type: "success",
					});

					dispatch(getClientData(user_data));
					KommunicateChat.loginUser(
						{
							userId: user_data.id,
							applicationId: kommunicate_appid,
							deviceApnsType: 0,
							displayName: `${user_data.first_name} ${user_data.last_name}`,
						},
						(res: string) => {
							if (res === "Success") {
								console.log(
									"Kchat user logged in successfully",
								);
							} else {
								console.log("An error occured");
							}
						},
					);
					reset({index: 0, routes: [{name: "drawer"}]});
				}
			}
		} catch (error: any) {
			if (error.message === "Network Error") {
				Toast.showToast({
					message: "There is a problem with your network connection!",
				});
				console.log(error);
			} else if (error.response) {
				// Request made but the server responded with an error
				Toast.showToast({message: "Something went wrong!"});
				throw new Error(JSON.stringify(error));
			} else if (error.request) {
				// Request made but no response is received from the server.
				Toast.showToast({message: "Sorry, the problem is from us."});
				throw new Error(JSON.stringify(error));
			} else {
				// Error occured while setting up the request
				Toast.showToast({message: "An error occured!"});
				throw new Error(JSON.stringify(error));
			}
		}
	}, [
		confirmPassword,
		imageUri,
		params.address,
		params.date_of_birth,
		params.email,
		params.first_name,
		params.gender,
		params.last_name,
		params.phone_number,
		password,
		reset,
		selectedState,
	]);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContent}>
				<Text style={styles.heading}>
					Proceed with these fields please
				</Text>
				<KeyboardAvoidingView behavior="height">
					<View style={styles.bioContainer}>
						<View style={styles.imageContainer}>
							{imageUri ? (
								<Image
									style={styles.image}
									source={{uri: imageUri.uri}}
								/>
							) : (
								<TouchableOpacity
									onPress={handleImageSelection}
									style={styles.image}>
									<Text>Upload photo!</Text>
									<FaIcon
										name="user"
										size={50}
										color={style.tertiaryColor}
									/>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								onPress={handleImageSelection}
								style={styles.imageUploadBtn}>
								<FaIcon
									name="camera"
									size={30}
									color={style.tertiaryColor}
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.passwordGroup}>
							<TextInput
								ref={passRef}
								value={password}
								placeholder="Password"
								placeholderTextColor={"#000"}
								onSubmitEditing={() =>
									confirmPassRef.current?.focus()
								}
								onChangeText={val => setPassword(val)}
								secureTextEntry={hidePassword}
								style={[
									styles.input,
									{flex: 1, borderBottomWidth: 0},
								]}
							/>
							<TouchableWithoutFeedback
								onPress={() => setHidePassword(prev => !prev)}>
								<FaIcon
									name={hidePassword ? "eye" : "eye-slash"}
									color={style.highlight}
									size={20}
								/>
							</TouchableWithoutFeedback>
						</View>
						<View style={styles.passwordGroup}>
							<TextInput
								ref={confirmPassRef}
								value={confirmPassword}
								placeholder="Confirm Password"
								placeholderTextColor={"#000"}
								onChangeText={val => setConfirmPassword(val)}
								secureTextEntry={hidePassword}
								style={[
									styles.input,
									{flex: 1, borderBottomWidth: 0},
								]}
							/>
							<TouchableWithoutFeedback
								onPress={() => setHidePassword(prev => !prev)}>
								<FaIcon
									name={hidePassword ? "eye" : "eye-slash"}
									color={style.highlight}
									size={20}
								/>
							</TouchableWithoutFeedback>
						</View>
						<View>
							<Text
								style={{
									paddingVertical: 10,
									fontSize: 18,
									color: style.primaryColor,
									fontFamily: "AltonaSans-Regular",
								}}>
								State of Residence:
							</Text>
							{/* dropdown state selection */}
							<Dropdown
								data={nigeria_states}
								selectedValue={selectedState}
								onChange={handleStateSelection}
								title={"State of Origin"}
							/>
						</View>
						<TouchableOpacity
							onPress={handleSignup}
							style={styles.signup}>
							<Text style={styles.signupText}>Sign Up</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		backgroundColor: "#fff",
		flex: 1,
	},

	logoContainer: {paddingVertical: 50},
	bgImage: {
		width: "100%",
		height: 80,
		resizeMode: "cover",
		padding: 15,
	},
	imageContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	image: {
		width: 120,
		height: 120,
		resizeMode: "contain",
		borderRadius: 100,
		backgroundColor: style.cardColor,
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	imageUploadBtn: {
		flex: 1,
		padding: 10,
		// ...StyleSheet.absoluteFill,
	},
	scrollContainer: {
		flex: 1,
		paddingHorizontal: 20,
	},
	scrollContent: {paddingBottom: 50},
	passwordGroup: {
		flexDirection: "row",
		position: "relative",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1.5,
		borderColor: style.tertiaryColor,
	},
	bioContainer: {
		flex: 1,
	},

	heading: {
		color: style.tertiaryColor,
		fontWeight: "700",
		fontSize: 20,
		marginVertical: 35,
		fontFamily: "AltonaSans-Regular",
	},
	input: {
		borderBottomWidth: 1.5,
		borderColor: style.tertiaryColor,
		color: style.primaryColor,
		paddingTop: 10,
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
		paddingHorizontal: 5,
	},
	inputLabel: {
		fontWeight: "500",
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
		color: style.primaryColor,
	},
	inputGroup: {
		flexDirection: "column",
	},
	signup: {
		marginTop: 100,
		flex: 1,
		padding: 12,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.highlight,
		shadowColor: style.titleColor,
		shadowOffset: {width: 0, height: 0},
		shadowRadius: 3,
		elevation: 12,
	},
	signupText: {
		fontSize: 18,
		fontFamily: "AltonaSans-Regular",
		color: style.tertiaryColor,
	},
});
