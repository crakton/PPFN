import React, {useEffect, useState} from "react";
import {View, TouchableOpacity, StyleSheet} from "react-native";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {INavigateProps} from "../interfaces";
import {style} from "../constants/style";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {styles} from "./DrawerScreenTopBar";
import {Image} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import whichSignedUser from "../utils/whichSignedUser";

export const CustomHeader = () => {
	const {navigate}: {navigate: INavigateProps} = useNavigation();
	const {dispatch} = useNavigation();
	const [user, setUser] = useState<string>("");

	useEffect(() => {
		(async () => {
			setUser(await whichSignedUser());
		})();
	});
	return (
		<View style={[styles.flexRow]}>
			<TouchableOpacity
				onPress={() => dispatch(DrawerActions.toggleDrawer())}
				style={{marginLeft: -15}}>
				<MCIcon name="menu" size={40} color={style.primaryColor} />
			</TouchableOpacity>
			<View style={styles2.headerright}>
				{user === "client" ? (
					<TouchableOpacity
						style={styles2.headerrightitem}
						onPress={() => navigate("support_chat")}>
						<Image
							source={require("../assets/images/chat_support.png")}
							style={{
								width: 32,
								resizeMode: "contain",
							}}
						/>
					</TouchableOpacity>
				) : null}
				<TouchableOpacity
					style={styles2.headerrightitem}
					onPress={() => navigate("notifications")}>
					<Icon name="bell" color={style.primaryColor} size={32} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles2 = StyleSheet.create({
	headerright: {
		flexDirection: "row",
		paddingHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerrightitem: {
		marginHorizontal: 5,
	},
});
