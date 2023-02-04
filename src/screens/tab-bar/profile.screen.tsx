import {memo, useEffect, useState} from "react";
import Icon from "react-native-vector-icons/Feather";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {CommonActions, useNavigation} from "@react-navigation/native";
import Layout from "../../layouts/ProfileLayout";
import {activeUser} from "../../constants/data";
import {style} from "../../constants/style";
import {INavigateProps} from "../../interfaces";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux.type";
import IProviderData from "../../interfaces/providerData";
import IClientData from "../../interfaces/clientData";
import convertToAge from "../../utils/convertToAge";
import whichSignedUser from "../../utils/whichSignedUser";
import ActivityLoader from "../../components/ActivityLoader";
const DetailItem = memo(
	({
		label,
		value,
		d,
	}: {
		label: string | null | undefined;
		value: string | null | undefined;
		d: boolean;
	}) => (
		<View
			style={{
				padding: 7,
				flex: 1,
				borderRadius: 7,
				flexDirection: "column",
				backgroundColor: d ? style.primaryColor : style.secondaryColor,
				marginHorizontal: 5,
			}}>
			<Text
				style={{
					color: "#fff",
					fontSize: 18,
					textAlign: "center",
					fontFamily: "AltonaSans-Regular",
				}}>
				{value}
			</Text>
			<Text
				style={{
					color: "#fff",
					fontSize: 18,
					textAlign: "center",
					fontFamily: "AltonaSans-Regular",
				}}>
				{label}
			</Text>
		</View>
	),
);

const Profile = memo(() => {
	const {goBack, navigate}: {navigate: INavigateProps; goBack: () => void} =
		useNavigation();

	const {client_data, provider_data} = useSelector(
		(state: RootState) => state.userData,
	);
	const [whichUser, setWhichUser] = useState<{
		data: IClientData | IProviderData;
		user: string | undefined;
	}>();
	useEffect(() => {
		(async () => {
			const user = await whichSignedUser();
			setWhichUser({
				user,
				data: user === "client" ? client_data : provider_data,
			});
		})();
	}, [client_data, provider_data]);
	if (!whichUser?.user) {
		return <ActivityLoader />;
	}

	return (
		<Layout
			profileImage={whichUser.data.photo_name.replace(
				"/image:",
				"/image%3A",
			)}
			edit={false}
			showRegisteredDateAndName={true}
			userName={`${whichUser?.data.first_name} ${whichUser?.data.last_name}`}
			registeredDate={whichUser.data.state}
			backBtn={true}
			goBack={goBack}>
			<View style={{flexDirection: "column"}}>
				<View style={{flexDirection: "row", alignItems: "center"}}>
					<Icon color="black" name="map-pin" size={20} />
					<Text style={styles.geoContactLocation}>
						{whichUser?.data.address}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginVertical: 15,
						marginHorizontal: -5,
					}}>
					<DetailItem
						value={convertToAge(whichUser?.data.date_of_birth)}
						label={"Age"}
						d={false}
					/>
					<DetailItem
						value={whichUser?.data.gender}
						label={"Sex"}
						d={true}
					/>
					{whichUser?.user === "provider" && (
						<DetailItem
							value={"300+"}
							label={"Patients"}
							d={false}
						/>
					)}
				</View>
				<View
					style={{
						flexDirection: "row",
						borderTopWidth: 1,
						borderBottomWidth: 1,
						borderColor: "#bbb",
						paddingVertical: 15,
					}}>
					<View
						style={{
							alignItems: "center",
							flex: 1,
							borderRightWidth: 1,
							borderColor: "#bbb",
						}}>
						<Icon name="phone" color={style.black} size={20} />
						<Text
							style={{
								fontFamily: "AltonaSans-Regular",
								color: style.black,
							}}>
							{whichUser?.data.phone_number}
						</Text>
					</View>
					<View
						style={{
							alignItems: "center",
							flex: 1,
						}}>
						<Icon name="mail" color={style.black} size={20} />
						<Text
							style={{
								fontFamily: "AltonaSans-Regular",
								color: style.black,
							}}>
							{whichUser?.data.email}
						</Text>
					</View>
				</View>
				<View>
					<TouchableOpacity
						onPress={() => navigate("edit_profile")}
						style={styles.login}>
						<Text style={styles.loginText}>Edit Profile</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Layout>
	);
});
export default Profile;

const styles = StyleSheet.create({
	login: {
		marginVertical: 30,
		flex: 1,
		padding: 12,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: style.highlight,
		shadowColor: style.black,
		shadowOffset: {width: 0, height: 0},
		shadowRadius: 3,
		elevation: 13,
	},
	loginText: {
		color: style.tertiaryColor,
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
	},
	geoContactLocation: {
		color: style.black,
		fontFamily: "AltonaSans-Regular",
		fontSize: 16,
		marginTop: 5,
	},
});
