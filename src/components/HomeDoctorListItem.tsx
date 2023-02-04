import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import React from "react";
import AntIcon from "react-native-vector-icons/AntDesign";
import {INavigateProps} from "../interfaces";
import {style} from "../constants/style";
import {Rating} from "./widgets/Rating";
import {useNavigation} from "@react-navigation/native";
import IListProvider from "../interfaces/listProvider";

export default function HomeDoctorListItem({...data}: IListProvider) {
	const {navigate}: {navigate: INavigateProps} = useNavigation();
	return (
		<View style={styles.container}>
			<View style={styles.imgContainer}>
				<Image
					style={styles.img}
					source={require("../assets/images/logo.png")}
				/>
			</View>
			<View
				style={{flex: 1, marginVertical: 20, flexDirection: "column"}}>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
						textTransform: "capitalize",
						color: style.primaryColor,
					}}>
					{data.first_name} {data.last_name}
				</Text>
				{data.experience ? (
					<Text
						style={{
							fontSize: 12,
							fontWeight: "500",
							color: style.titleColor,
						}}>
						{data.experience} years experience
					</Text>
				) : null}
				<View style={{flexDirection: "row", marginVertical: 5}}>
					<Text style={styles.clinic}>{data.facility}</Text>
				</View>
				<View style={{width: "60%", marginTop: 5}}>
					{data.rating ? <Rating rate={data.rating} max={5} /> : null}
				</View>
			</View>
			{/* <View style={{justifyContent: 'center', paddingHorizontal: 5}}>
				{data.status ? (
					<View
						style={{
							padding: 5,
							borderRadius: 99,
							backgroundColor: 'limegreen',
						}}
					/>
				) : (
					<View
						style={{
							padding: 5,
							borderRadius: 99,
							backgroundColor: '#bbb',
						}}
					/>
				)}
			</View> */}
			<View style={{flexDirection: "column"}}>
				<TouchableOpacity
					onPress={() => navigate("doctor_appointment", data)}
					style={styles.secondaryBtn}>
					<AntIcon
						color={style.highlight}
						size={30}
						name="calendar"
					/>
				</TouchableOpacity>
				{/* <TouchableOpacity onPress={() => initCall(false, () => {
					navigate('call', {
						isVideoCall: false,
						callee: data.phone_number,
						isIncomingCall: false,
					});

				})} style={styles.primaryBtn}>
					<AntIcon color={style.highlight} size={30} name="phone" />
				</TouchableOpacity> */}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: style.cardColor,
		borderRadius: 15,
		overflow: "hidden",
		elevation: 3,
		marginVertical: 5,
	},
	imgContainer: {
		height: 55,
		width: 55,
		overflow: "hidden",
		borderRadius: 100,
		marginVertical: 15,
		marginHorizontal: 10,
	},
	img: {
		width: 55,
		height: 55,
	},
	secondaryBtn: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.secondaryColor,
		paddingHorizontal: 15,
	},
	primaryBtn: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.tertiaryColor,
		paddingHorizontal: 15,
	},
	clinic: {
		fontSize: 12,
		fontWeight: "bold",
		color: style.secondaryColor,
		backgroundColor: style.highlight,
		flexDirection: "row",
		padding: 7,
		borderRadius: 5,
	},
});
