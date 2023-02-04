import React, {memo, useEffect, useState} from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";

import TabNav from "./tab.navigation";
import CustomDrawerNavigation from "../components/custom.drawer";
import whichSignedUser from "../utils/whichSignedUser";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {style} from "../constants/style";
import {INavigateProps} from "../interfaces";
import Contact from "../screens/drawer/Contact";
import About from "../screens/drawer/About";
import Notifications from "../screens/drawer/Notifications";
import Report from "../screens/tab-bar/report.screen";

const Drawer = createDrawerNavigator();

const DrawerNav = memo(() => {
	const {navigate}: {navigate: INavigateProps} = useNavigation();
	const [user, setUser] = useState<string>("");
	useEffect(() => {
		(async () => {
			setUser(await whichSignedUser());
		})();
	}, []);
	return (
		<Drawer.Navigator
			screenOptions={{
				headerTitle: "",
				headerShown: false,
				headerRight: props => {
					return (
						<View style={styles.headerright}>
							{user === "client" ? (
								<TouchableOpacity
									style={styles.headerrightitem}
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
								style={styles.headerrightitem}
								onPress={() => navigate("notifications")}>
								<Icon
									name="bell"
									color={style.primaryColor}
									size={32}
								/>
							</TouchableOpacity>
						</View>
					);
				},
			}}
			drawerContent={props => <CustomDrawerNavigation {...props} />}>
			<Drawer.Group key={"main"}>
				<Drawer.Screen name="tabs" component={TabNav} />
				<Drawer.Screen name="reports" component={Report} />
				<Drawer.Screen name="notifications" component={Notifications} />
			</Drawer.Group>

			<Drawer.Group key={"services"}>
				<Drawer.Screen name="contact-us" component={Contact} />
				<Drawer.Screen name="about-us" component={About} />
			</Drawer.Group>
		</Drawer.Navigator>
	);
});

const styles = StyleSheet.create({
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

export default DrawerNav;
