import {View, Text, TouchableOpacity, StyleSheet, Alert} from "react-native";
import React, {useCallback} from "react";
import AntIcon from "react-native-vector-icons/AntDesign";
import FaIcon from "react-native-vector-icons/FontAwesome";
import {style} from "../constants/style";
import {Rating} from "./widgets/Rating";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../types/redux.type";
import formatDate from "../screens/auth/formatDate";
import axios from "axios";
import {updateReport} from "../redux/reports";
import {useNavigation} from "@react-navigation/native";
import {INavigateProps} from "../interfaces";
import {Toast} from "react-native-awesome";

export default function ReportDocListItem(props: any) {
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const dispatch = useDispatch();
	const {navigate} = useNavigation<{navigate: INavigateProps}>();

	const handleDownload = useCallback((id: number) => {}, []);
	const handlePreview = useCallback((id: number) => {}, []);
	const handleDeleteReport = useCallback(
		(id: number) => {
			Alert.alert(
				"Confirm Deletion",
				"Are you okay with this operation?",
				[
					{
						text: "confirm",
						onPress: async () => {
							try {
								const response = await axios({
									url: `https://ppfnhealthapp.com/api/report/${id}`,
									method: "POST",
									data: `provider_id=${provider_data.id}&_methhod=delete`,
									headers: {
										"Content-Type": "multipart/form-data",
									},
								});
								if (response.status === 200) {
									axios
										.get(
											`https://ppfnhealthapp.com/api/report`,
											{
												data: {
													provider_id:
														provider_data.id,
												},
											},
										)
										.then(res => {
											Toast.showToast({
												message:
													"Successfully deleted!",
												type: "success",
												duration: 2000,
											});
											dispatch(updateReport(res.data));
											navigate("reports");
										})
										.catch(error => console.log(error));
								}
							} catch (error: any) {
								if (error.message === "Network Error") {
									Toast.showToast({message: "Network Error"});
									console.log(error);
								}
								console.log(JSON.stringify(error));
							}
						},
					},
					{
						text: "Cancel",
					},
				],
			);
		},
		[dispatch, provider_data.id],
	);
	return (
		<View style={styles.container}>
			<View style={styles.imgContainer}>
				<AntIcon
					color={style.secondaryColor}
					size={60}
					name="filetext1"
				/>
			</View>
			<View
				style={{flex: 1, marginVertical: 20, flexDirection: "column"}}>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
						color: style.primaryColor,
					}}>
					{props.title}
				</Text>
				<Text
					style={{
						fontSize: 12,
						fontWeight: "500",
						color: style.titleColor,
					}}>
					{formatDate(props.created_at)}
				</Text>
				<View style={{flexDirection: "row", marginVertical: 5}}>
					{props.clinic && (
						<Text style={styles.clinic}>{props.clinic}</Text>
					)}
					{props.status && (
						<Text style={styles.clinic}>{props.status}</Text>
					)}
				</View>
				<View style={{width: "60%", marginTop: 5}}>
					<Rating rate={provider_data.rating} max={5} />
				</View>
			</View>
			<View style={{flexDirection: "column"}}>
				{props.download ? (
					<>
						<TouchableOpacity
							onPress={() => handlePreview(props.id)}
							style={styles.secondaryBtn}>
							<AntIcon
								color={style.highlight}
								size={30}
								name="eye"
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.primaryBtn}
							onPress={() => handleDownload(props.id)}>
							<AntIcon
								color={style.highlight}
								size={30}
								name="download"
							/>
						</TouchableOpacity>
					</>
				) : (
					<TouchableOpacity
						style={styles.primaryBtn}
						onPress={() => handleDeleteReport(props.id)}>
						{props.clinic && (
							<AntIcon
								color={style.highlight}
								size={30}
								name="download"
							/>
						)}
						{props.status && (
							<FaIcon color={"#f00"} size={30} name="times" />
						)}
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		backgroundColor: "#eee",
		borderRadius: 15,
		overflow: "hidden",
		elevation: 3,
	},
	imgContainer: {
		height: 110,
		width: 110,
		overflow: "hidden",
		borderRadius: 999,
		marginVertical: 15,
		marginHorizontal: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	img: {
		height: "100%",
		width: "100%",
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
