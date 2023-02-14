import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import React, {memo, useCallback} from "react";
import KommunicateChat from "react-native-kommunicate-chat";
import {kommunicate_appid} from "@env";
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
import FaIcon from "react-native-vector-icons/FontAwesome";
import {useDispatch} from "react-redux";
import loginClient from "../../apis/client/loginClient";
import loginProvider from "../../apis/provider/loginProvider";

import {style} from "../../constants/style";
import {INavigateProps} from "../../interfaces";
import IClientData from "../../interfaces/clientData";
import IProviderData from "../../interfaces/providerData";
import {isSigned} from "../../redux/auth/isSigned";
import {getClientData, getProviderData} from "../../redux/user/userData";
import {Toast} from "react-native-awesome";
import ActivityLoader from "../../components/ActivityLoader";
import firebaseServices from "../../services/firebase.service";
import {verifyProvider} from "../../apis/email-verification";

const Login = memo(() => {
	const {
		navigate,
		reset,
	}: {
		navigate: INavigateProps;
		reset: (state: {index: number; routes: {name: string}[]}) => void;
	} = useNavigation();
	const dispatch = useDispatch();
	const userRef = React.useRef<TextInput>(null);
	const passRef = React.useRef<TextInput>(null);
	const [isConnecting, setIsconnecting] = React.useState(false);
	const [password, setPassword] = React.useState<string>();
	const [username, setUsername] = React.useState<string>();
	const [hidePassword, setHidePassword] = React.useState<boolean>(true);

	const handleSubmission = useCallback(async () => {
		if (!username) {
			Toast.showToast({
				message: "Email is required!",
				type: "danger",
				duration: 2000,
			});
			return;
		}
		if (!password) {
			Toast.showToast({
				message: "Password is required!",
				type: "danger",
				duration: 2000,
			});
			return;
		}
		const __ud__ = {email: username, hash: password};
		setIsconnecting(true);

		try {
			const response_client = await loginClient(JSON.stringify(__ud__));

			if (
				(response_client?.data.status !== false &&
					response_client?.data.status === null) ||
				response_client?.data.status === "Active"
			) {
				const fireresponse = await firebaseServices.signinEmailPassword(
					username,
					password,
				);

				if (fireresponse.code !== "auth/user-not-found") {
					await AsyncStorage.multiSet([
						["is_signed", "yes"],
						["is_client", "yes"],
						["is_provider", "no"],
						["user_data", JSON.stringify(response_client?.data)],
					]);

					const signed = await AsyncStorage.getItem("is_signed");

					const user_data: IClientData = JSON.parse(
						await AsyncStorage.getItem("user_data"),
					);

					await firebaseServices.updateUserDoc(
						`@${user_data.last_name.split(" ").join("")}${
							user_data.id
						}`,
						{fcm_token: await firebaseServices.getFCMToken()},
					);

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
					Toast.showToast({
						message: "Login successful",
						type: "success",
					});

					setTimeout(() => {
						dispatch(getClientData(user_data));
						dispatch(isSigned(signed));
						reset({index: 0, routes: [{name: "drawer"}]});
					}, 1000);
					return;
				}
			} else if (response_client.data.status === "false") {
				setIsconnecting(false);
				setPassword("");
				setUsername("");
				userRef.current?.focus();
				Toast.showToast({
					message: "Invalid user inputs",
					type: "warning",
					duration: 2000,
				});
			}
		} catch (error: any) {
			console.log(error);
			setPassword("");
			setUsername("");
			if (error.message === "Network Error") {
				setIsconnecting(false);
				Toast.showToast({
					message: "There is a problem with your network connection!",
				});
			} else {
				setIsconnecting(false);
				Toast.showToast({message: "An error occured!"});
				console.error(error);
			}
			if (error.response) {
				// Request made but the server responded with an error
				Toast.showToast({message: "Something went wrong!"});
				console.warn(error);
			}
			if (error.request) {
				// Request made but no response is received from the server.
				Toast.showToast({message: "Sorry, the problem is from us."});
				console.warn(error);
			}
			// Error occured while setting up the request
			Toast.showToast({message: "An error occured!"});
			console.warn(error);
		}

		const verifyProviderResponse = await verifyProvider(username);

		if (verifyProviderResponse?.status !== 200) {
			Toast.showToast({
				message:
					"Account does not exist. If you are a provider please contact Admin.",
				type: "danger",
				duration: 3000,
			});
			setIsconnecting(false);
			return;
		}
		try {
			const response_provider = await loginProvider(
				JSON.stringify(__ud__),
			);
			if (
				(response_provider?.data.status !== false &&
					response_provider?.data.status === null) ||
				response_provider?.data.status === "Active"
			) {
				const fireresponse = await firebaseServices.signinEmailPassword(
					username,
					password,
				);

				if (
					fireresponse.code === "auth/user-not-found" ||
					fireresponse.user.email === username
				) {
					firebaseServices
						.signupEmailPassword(username, password)
						.then(async () => {
							await AsyncStorage.multiSet([
								["is_signed", "yes"],
								["is_provider", "yes"],
								["is_client", "no"],
								[
									"provider_data",
									JSON.stringify(response_provider?.data),
								],
							]);
							const signed = await AsyncStorage.getItem(
								"is_signed",
							);
							const provider_data: IProviderData = JSON.parse(
								await AsyncStorage.getItem("provider_data"),
							);
							await firebaseServices.addUserDoc(
								`@${provider_data.last_name
									.split(" ")
									.join("")}${provider_data.id}`,
								{
									fcm_token:
										await firebaseServices.getFCMToken(),
								},
							);
							setTimeout(() => {
								dispatch(getProviderData(provider_data));
								dispatch(isSigned(signed));
								reset({
									index: 0,
									routes: [{name: "drawer"}],
								});
							}, 1000);
							Toast.showToast({
								message: "Login successful",
								type: "success",
							});
						});
				}
				return;
			} else if (response_provider.data.status === "false") {
				setIsconnecting(false);
				setPassword("");
				setUsername("");
				userRef.current?.focus();
				Toast.showToast({
					message: "Invalid user inputs",
					type: "warning",
					duration: 2000,
				});
			}
		} catch (error: any) {
			console.log(error);

			setPassword("");
			setUsername("");
			if (error.message === "Network Error") {
				setIsconnecting(false);
				Toast.showToast({
					message: "There is a problem with your network connection!",
				});
			} else {
				setIsconnecting(false);
				Toast.showToast({message: "An error occured!"});
				console.error(error);
			}
			if (error.response) {
				// Request made but the server responded with an error
				Toast.showToast({message: "Something went wrong!"});
				console.warn(error);
			}
			if (error.request) {
				// Request made but no response is received from the server.
				Toast.showToast({message: "Sorry, the problem is from us."});
				console.warn(error);
			}
			// Error occured while setting up the request
			Toast.showToast({message: "An error occured!"});
			console.warn(error);
		}
	}, [dispatch, password, reset, username]);
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContent}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.bgImage}
						source={require("../../assets/images/ppfn_logo.png")}
					/>
				</View>
				<Text style={styles.heading}>Login</Text>
				<KeyboardAvoidingView behavior="height">
					<View style={styles.bioContainer}>
						<TextInput
							ref={userRef}
							placeholder="Username"
							placeholderTextColor={style.primaryColor}
							style={styles.input}
							keyboardType={"email-address"}
							value={username}
							onChangeText={val => setUsername(val)}
							onSubmitEditing={() => passRef.current?.focus()}
							blurOnSubmit={false}
						/>
						<View style={styles.passwordGroup}>
							<TextInput
								ref={passRef}
								value={password}
								placeholder="Password"
								placeholderTextColor={style.primaryColor}
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
						{isConnecting ? (
							<View style={{marginTop: 50}}>
								<ActivityLoader />
							</View>
						) : null}

						<TouchableOpacity
							onPress={handleSubmission}
							style={styles.login}>
							<Text style={styles.loginText}>Sign In</Text>
						</TouchableOpacity>
						<View style={styles.forgotBox}>
							<Text style={styles.forgotText}>
								forgotten password?
							</Text>
							<TouchableOpacity
								onPress={() => navigate("forgot_password")}>
								<Text style={{color: style.secondaryColor}}>
									Reset it
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.loginBox}>
							<TouchableWithoutFeedback
								onPress={() => navigate("new_users")}>
								<Text style={styles.loginText}>Sign Up</Text>
							</TouchableWithoutFeedback>
						</View>
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
});

export default Login;

const styles = StyleSheet.create({
	container: {
		position: "relative",
		backgroundColor: "#fff",
		flex: 1,
	},

	logoContainer: {paddingVertical: 50, marginTop: 50},
	bgImage: {
		width: "100%",
		height: 50,
		resizeMode: "center",
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
		color: style.secondaryColor,
		fontWeight: "700",
		fontSize: 25,
		marginVertical: 5,
		letterSpacing: 2,
	},
	input: {
		borderBottomWidth: 1.5,
		borderColor: style.tertiaryColor,
		color: style.primaryColor,
		letterSpacing: 1,
		fontSize: 16,
		paddingTop: 10,
		paddingHorizontal: 5,
	},
	inputGroup: {
		flexDirection: "column",
	},
	login: {
		marginTop: 50,
		flex: 1,
		padding: 12,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.highlight,
		shadowColor: style.titleColor,
		shadowOffset: {width: 0, height: 0},
		elevation: 12,
	},
	loginBox: {
		flexDirection: "row",
		paddingHorizontal: 5,
		marginTop: 10,
	},
	loginText: {
		color: style.secondaryColor,
		fontSize: 14,
		fontWeight: "500",
	},
	loginBtn: {
		color: "#809FD5",
		fontSize: 14,
		fontWeight: "500",
	},
	forgotBox: {
		flexDirection: "row",
		marginTop: 10,
	},
	forgotText: {
		color: style.titleColor,
		fontSize: 15,
		fontWeight: "500",
		paddingHorizontal: 5,
	},
});
