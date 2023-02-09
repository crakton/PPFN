import {useNavigation} from "@react-navigation/native";
import React, {memo, useCallback} from "react";
import {
	Image,
	KeyboardAvoidingView,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {Toast} from "react-native-awesome";
import DatePicker from "react-native-date-picker";
import AntIcon from "react-native-vector-icons/AntDesign";
import {style} from "../../constants/style";
import {WIDTH} from "../../utils/dim";

const NewUser = memo(() => {
	const [dob, setDob] = React.useState(new Date());
	const [fullname, setFullname] = React.useState<string>();
	const [address, setAddress] = React.useState<string>();
	const [phoneNumber, setPhoneNumber] = React.useState<string>();
	const [email, setEmail] = React.useState<string>();
	const [gender, setGender] = React.useState<string>("Male");
	const [openDob, setOpenDob] = React.useState(false);
	const [activeGender, setActiveGender] = React.useState(true);

	const addressRef = React.useRef<TextInput>(null);
	const emailRef = React.useRef<TextInput>(null);
	const fullnameRef = React.useRef<TextInput>(null);
	const phoneRef = React.useRef<TextInput>(null);

	const {navigate}: {navigate: (s1: string, opt?: {}) => void} =
		useNavigation();
	const handleDob = useCallback((newdate: Date) => {
		setOpenDob(false);
		setDob(newdate);
	}, []);

	const handleGender = useCallback((key: number) => {
		if (key === 0) {
			setActiveGender(false);
			setGender("Female");
		} else {
			setActiveGender(true);
			setGender("Male");
		}
	}, []);
	const handleFormSubmission = useCallback(() => {
		if (!fullname) {
			Toast.showToast({
				message: "Fullname required!",
				type: "danger",
				duration: 2000,
			});
			fullnameRef.current?.focus();
			return;
		}
		const lastname = fullname.trim().split(" ").splice(1).join("");

		if (lastname === null || lastname === "") {
			Toast.showToast({
				message: "Fullname required!",
				type: "danger",
				duration: 2000,
			});
			fullnameRef.current?.focus();
			return;
		}
		if (!address) {
			Toast.showToast({
				message: "Address required!",
				type: "danger",
				duration: 2000,
			});
			addressRef.current?.focus();
			return;
		}
		if (!phoneNumber) {
			Toast.showToast({
				message: "Phone number required!",
				type: "danger",
				duration: 2000,
			});
			phoneRef.current?.focus();
			return;
		}
		const areacode = phoneNumber.slice(0, 4);

		if (areacode !== "+234" || phoneNumber.length !== 14) {
			Toast.showToast({
				message: "Phone should start with +234 & ends with 10 digits",
				type: "danger",
				duration: 2000,
			});
			setPhoneNumber("+234");
			phoneRef.current?.focus();
			return;
		}
		if (
			!email ||
			!email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
			)
		) {
			Toast.showToast({
				message: "Valid email address required!",
				type: "danger",
				duration: 2000,
			});
			emailRef.current?.focus();
			return;
		}
		if (!dob) {
			return;
		}
		if (!gender) {
			return;
		}
		function formatDob() {
			const format = dob.toLocaleDateString().split("/");
			const year = format[2];
			const month =
				format[0].toString().length === 1
					? "0".concat(format[0])
					: format[0]; // using mm starting from 1
			const day =
				format[1].toString().length === 1
					? "0".concat(format[1])
					: format[1]; // using dd starting from 1
			return year + "-" + month + "-" + day;
		}
		const user = {
			address,
			first_name: fullname.trim().split(" ").slice(0, 1).join(""),
			last_name: fullname.trim().split(" ").slice(1).join(" "),
			date_of_birth: formatDob(),
			email,
			gender,
			phone_number: phoneNumber,
		};
		navigate("other_form_details", user);
	}, [address, dob, email, fullname, gender, navigate, phoneNumber]);

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
				<Text style={styles.heading}>Create an account</Text>
				<KeyboardAvoidingView behavior="height">
					<View style={styles.bioContainer}>
						<TextInput
							ref={fullnameRef}
							placeholder="Full Name"
							placeholderTextColor={style.primaryColor}
							style={styles.input}
							onSubmitEditing={() => addressRef.current?.focus()}
							blurOnSubmit={false}
							value={fullname}
							onChangeText={val => setFullname(val)}
						/>

						<TextInput
							ref={addressRef}
							placeholder="Resident Address"
							placeholderTextColor={style.primaryColor}
							style={styles.input}
							keyboardType="name-phone-pad"
							onSubmitEditing={() => phoneRef.current?.focus()}
							blurOnSubmit={false}
							value={address}
							onChangeText={val => setAddress(val)}
						/>

						<TextInput
							ref={phoneRef}
							maxLength={14}
							placeholder="Phone Number"
							placeholderTextColor={style.primaryColor}
							style={styles.input}
							keyboardType="phone-pad"
							onSubmitEditing={() => emailRef.current?.focus()}
							blurOnSubmit={false}
							value={phoneNumber}
							onChangeText={val => setPhoneNumber(val)}
						/>

						<TextInput
							ref={emailRef}
							placeholder="Email Address"
							placeholderTextColor={style.primaryColor}
							style={styles.input}
							keyboardType="email-address"
							value={email}
							onChangeText={val => setEmail(val)}
						/>
						<View style={styles.inputGroup}>
							<Text style={styles.inputLabel}>Date of Birth</Text>
							<DatePicker
								modal
								title={"Date of Birth"}
								mode="date"
								date={dob}
								open={openDob}
								onConfirm={handleDob}
								onCancel={() => {
									setOpenDob(false);
								}}
							/>
							<View style={styles.dob}>
								<TextInput
									style={styles.dobText}
									onPressIn={() => setOpenDob(true)}
									value={dob.toLocaleDateString()}
								/>
								<TouchableOpacity
									onPress={() => setOpenDob(true)}>
									<AntIcon
										name="calendar"
										size={24}
										color="#809FD5"
									/>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.gender}>
							<Text style={styles.inputLabel}>Sex</Text>
							<View style={styles.genderGroup}>
								<TouchableOpacity
									onPress={() => handleGender(1)}
									style={[
										styles.genderType,
										{
											backgroundColor: activeGender
												? "#1A216C"
												: "#dde",
											borderBottomLeftRadius: 5,
											borderTopLeftRadius: 5,
										},
									]}>
									<Text
										style={{
											color: activeGender
												? "#eee"
												: "#333",
										}}>
										Male
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => handleGender(0)}
									style={[
										styles.genderType,
										{
											backgroundColor: !activeGender
												? "#1A216C"
												: "#ddd",
											borderBottomRightRadius: 5,
											borderTopRightRadius: 5,
										},
									]}>
									<Text
										style={{
											color: !activeGender
												? "#eee"
												: "#333",
										}}>
										Female
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity
							disabled={
								!fullname ||
								!address ||
								!phoneNumber ||
								!email ||
								!dob
							}
							style={[
								styles.signup,
								!fullname ||
								!address ||
								!phoneNumber ||
								!email ||
								!dob
									? {backgroundColor: "lightgray"}
									: null,
							]}
							onPress={handleFormSubmission}>
							<Text style={styles.signupText}>Proceed</Text>
						</TouchableOpacity>
						<View style={styles.loginBox}>
							<Text style={styles.loginText}>
								Already Registered?
							</Text>
							<TouchableOpacity onPress={() => navigate("login")}>
								<Text style={styles.loginBtn}> Sign In</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</ScrollView>
		</SafeAreaView>
	);
});

export default NewUser;

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
	bioContainer: {
		flex: 1,
	},
	dob: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1.5,
		borderColor: "#4c54af",
	},
	dobText: {
		color: style.primaryColor,
	},
	heading: {
		color: "#809FD5",
		fontWeight: "700",
		fontSize: 24,
		marginVertical: 5,
	},
	gender: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	genderGroup: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		width: WIDTH / 2.2,
		borderRadius: 20,
		marginTop: 10,
	},
	genderType: {
		padding: 5,
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	input: {
		borderBottomWidth: 1.5,
		borderColor: "#4c54af",
		color: style.primaryColor,
		paddingTop: 8,
		paddingHorizontal: 5,
		marginBottom: 10,
	},
	inputLabel: {
		paddingHorizontal: 5,
		fontSize: 14,
		color: style.primaryColor,
		marginTop: 10,
	},
	inputGroup: {
		flexDirection: "column",
	},
	signup: {
		flex: 1,
		padding: 12,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.highlight + "ef",
		shadowColor: "#8b8b8b",
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 2,
		marginTop: 15,
	},
	signupText: {color: style.secondaryColor, fontWeight: "500"},
	loginBox: {
		flexDirection: "row",
		paddingHorizontal: 5,
		marginTop: 10,
	},
	loginText: {
		color: style.titleColor,
		fontSize: 14,
		fontWeight: "500",
	},
	loginBtn: {
		color: style.secondaryColor,
		fontSize: 14,
		fontWeight: "500",
	},
});
