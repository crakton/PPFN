/* eslint-disable no-spaced-func */
import React, {memo, useEffect, useState} from "react";
import {
	ImageBackground,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import FeIcon from "react-native-vector-icons/Feather";

import {HeaderWithBackButton} from "../../components/HeaderWithBackButton";
import {StarRating} from "../../components/widgets/StarRating";
import {style} from "../../constants/style";
import IListProvider from "../../interfaces/listProvider";
import {HEIGHT} from "../../utils/dim";
import convertToAge from "../../utils/convertToAge";
import whichSignedUser from "../../utils/whichSignedUser";

const DoctorAppointment = memo(() => {
	const {params} = useRoute<RouteProp<{params: IListProvider}>>();
	const {navigate} = useNavigation<{
		navigate: (route: string, opt: object) => void;
	}>();
	const [whichUser, setWhichUser] = useState<string>();
	useEffect(() => {
		(async () => {
			setWhichUser(await whichSignedUser());
		})();
	}, []);
	return (
		<SafeAreaView>
			<ScrollView>
				<ImageBackground
					imageStyle={{resizeMode: "cover"}}
					style={{height: HEIGHT / 2}}
					source={require("../../assets/images/fallback.png")}>
					<HeaderWithBackButton />
				</ImageBackground>
				<View style={styles.nameContainer}>
					<View
						style={{
							flexDirection: "column",
						}}>
						<Text style={styles.fullname}>
							{params.first_name} {params.last_name}
						</Text>
						<Text style={styles.geoContactEmail}>
							{params.email}
						</Text>
						<Text style={styles.geoContactLocation}>
							<FeIcon
								name="map-pin"
								size={24}
								color={style.black}
							/>
							{params.facility}
						</Text>
					</View>
					{params.rating >= 1 ? (
						<View
							style={{
								flexDirection: "column",
							}}>
							<StarRating
								color={style.secondaryColor}
								rate={params.rating}
								max={5}
							/>
							{/*
						<TouchableOpacity>
							<Text style={{ color: style.titleColor }}>
								See all reviews ({Math.floor(Math.random() * 500)})
							</Text>
						</TouchableOpacity>
						*/}
						</View>
					) : null}
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						paddingHorizontal: 10,
						marginVertical: 10,
					}}>
					<View style={styles.colorOne}>
						<Text style={styles.statsInfo}>
							{convertToAge(params.date_of_birth)}
						</Text>
						<Text style={styles.statsInfo}>Age</Text>
					</View>
					<View style={styles.colorTwo}>
						<Text style={styles.statsInfo}>Sex</Text>
						<Text style={styles.statsInfo}>{params.gender}</Text>
					</View>
					{params.popularity && (
						<View style={styles.colorOne}>
							<Text style={styles.statsInfo}>
								{params.popularity}
							</Text>
							{/* generated age from 25 to 60 */}
							<Text style={styles.statsInfo}>Patients</Text>
						</View>
					)}
					{params.experience && (
						<View style={styles.colorTwo}>
							<Text style={styles.statsInfo}>
								{params.experience}
							</Text>
							<Text style={styles.statsInfo}>Exp.</Text>
						</View>
					)}
				</View>
				<View style={styles.category}>
					<Text style={styles.categoryLabel}>Profession:</Text>
					<Text style={styles.categoryText}>{params.category}</Text>
				</View>
				<View style={{paddingHorizontal: 10, marginBottom: 20}}>
					{whichUser === "client" && (
						<TouchableOpacity
							onPress={() =>
								navigate("bookings", {
									...params,
								})
							}
							style={styles.appointmentBtn}>
							<Text style={styles.btnText}>
								Book an Appointment
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
});

export default DoctorAppointment;
const styles = StyleSheet.create({
	appointmentBtn: {
		marginTop: 50,
		padding: 10,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.highlight,
		shadowColor: style.black,
		shadowOpacity: 0.7,
		shadowRadius: 3,
		elevation: 2,
	},
	btnText: {
		color: style.tertiaryColor,
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
	},
	category: {
		flexDirection: "row",
		paddingHorizontal: 15,
		alignItems: "center",
	},
	categoryLabel: {
		color: style.primaryColor,
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
	},
	categoryText: {
		color: style.tertiaryColor,
		fontFamily: "AltonaSans-Regular",
		fontSize: 16,
	},
	colorOne: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.secondaryColor,
		flex: 1,
		marginHorizontal: 3,
		borderRadius: 10,
		padding: 5,
	},
	colorTwo: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.primaryColor,
		flex: 1,
		marginHorizontal: 3,
		borderRadius: 10,
		padding: 5,
	},
	nameContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
	},
	fullname: {
		fontFamily: "AltonaSans-Regular",
		fontSize: 22,
		fontWeight: "500",
		color: style.primaryColor,
		textTransform: "capitalize",
	},
	geoContactEmail: {
		fontFamily: "AltonaSans-Italic",
		fontSize: 18,
		color: style.titleColor,
		marginTop: 5,
	},
	geoContactLocation: {
		color: style.black,
		fontFamily: "AltonaSans-Regular",
		fontSize: 16,
		marginTop: 5,
	},
	statsInfo: {
		color: style.highlight,
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
		fontWeight: "500",
	},
});
