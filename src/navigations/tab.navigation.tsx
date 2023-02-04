import React, {memo, useCallback, useEffect, useState} from "react";
import {SafeAreaView, StatusBar, Text} from "react-native";
import {
	AnimatedTabBarNavigator,
	TabElementDisplayOptions,
	TabButtonLayout,
	DotSize,
} from "react-native-animated-nav-tab-bar";
import {ErrorBoundary} from "react-native-awesome";
import AntIcon from "react-native-vector-icons/AntDesign";
import EnIcon from "react-native-vector-icons/Entypo";
import EvIcon from "react-native-vector-icons/EvilIcons";
import IIcon from "react-native-vector-icons/Ionicons";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import ActivityLoader from "../components/ActivityLoader";
import Appointments from "../screens/tab-bar/appointment.screen";
import Booknow from "../screens/tab-bar/book-now.screen";
import Home from "../screens/tab-bar/home.screen";
import Profile from "../screens/tab-bar/profile.screen";
import Report from "../screens/tab-bar/report.screen";
import Timeslot from "../screens/tab-bar/time-slot.screen";
import whichSignedUser from "../utils/whichSignedUser";

const Tab = AnimatedTabBarNavigator();

const TabNav = memo(() => {
	const [whichUser, setWhichUser] = useState("");

	useEffect(() => {
		getWhichUser();
	}, []);

	const getWhichUser = useCallback(
		async () => setWhichUser(await whichSignedUser()),
		[],
	);

	if (!whichUser) {
		return <ActivityLoader />;
	}
	return (
		<ErrorBoundary>
			<StatusBar backgroundColor={"#442d72"} />
			<Tab.Navigator
				tabBarOptions={{
					labelStyle: {
						fontSize: 10,
					},
					tabStyle: {
						paddingTop: 0,
						paddingBottom: 0,
						paddingLeft: 0,
						paddingRight: 0,
					},
				}}
				appearance={{
					dotSize: DotSize.SMALL,
					tabBarBackground: "#442d72",
					activeTabBackgrounds: "transparent",
					tabButtonLayout: TabButtonLayout.VERTICAL,
					activeColors: "#cce3f4",
					whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
				}}>
				<Tab.Screen
					name="home"
					options={{
						tabBarIcon: ({focused, color, size}: any) => (
							<EnIcon
								color={focused ? color : "#CED4D3"}
								name={"home"}
								size={size}
							/>
						),
						tabBarLabel: "Home",
						tabBarLabelFontSize: 13,
					}}
					component={Home}
				/>
				<Tab.Screen
					name="appointments"
					options={{
						tabBarIcon: ({focused, color, size}: any) => (
							<AntIcon
								color={focused ? color : "#CED4D3"}
								name={"calendar"}
								size={size}
							/>
						),
						tabBarLabel: "Appointments",
						tabBarLabelFontSize: 13,
					}}
					component={Appointments}
				/>
				{whichUser === "client" ? (
					<Tab.Screen
						name="bookings"
						options={{
							tabBarIcon: ({focused, color, size}: any) => (
								<MCIcon
									color={focused ? color : "#CED4D3"}
									name={"clock-plus-outline"}
									size={size}
								/>
							),
							tabBarLabel: "Book Now",
						}}
						component={Booknow}
					/>
				) : (
					<Tab.Screen
						name="timeslot"
						options={{
							tabBarIcon: ({focused, color, size}: any) => (
								<MCIcon
									color={focused ? color : "#CED4D3"}
									name={"clock"}
									size={size}
								/>
							),
							tabBarLabel: "Timeslot",
						}}
						component={Timeslot}
					/>
				)}
				<Tab.Screen
					name="report"
					options={{
						tabBarIcon: ({focused, color, size}: any) => (
							<IIcon
								color={focused ? color : "#CED4D3"}
								name={"md-document-text"}
								size={size}
							/>
						),
						tabBarLabel: "Reports",
					}}
					component={Report}
				/>
				<Tab.Screen
					name="profile"
					options={{
						tabBarIcon: ({focused, color, size}: any) => (
							<IIcon
								color={focused ? color : "#CED4D3"}
								name={"person"}
								size={size}
							/>
						),
						tabBarLabel: "Profile",
					}}
					component={Profile}
				/>
			</Tab.Navigator>
		</ErrorBoundary>
	);
});

export default TabNav;
