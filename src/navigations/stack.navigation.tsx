import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	useNavigation,
	useNavigationContainerRef,
} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React, {memo, useEffect, useLayoutEffect} from "react";
import {ErrorBoundary} from "react-native-awesome";
import {useDispatch, useSelector} from "react-redux";
import notifee, {EventType} from "@notifee/react-native";

import ActivityLoader from "../components/ActivityLoader";

import IClientData from "../interfaces/clientData";
import IProviderData from "../interfaces/providerData";
import {isSigned} from "../redux/auth/isSigned";
import {getClientData, getProviderData} from "../redux/user/userData";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Login from "../screens/auth/Login";
import NewUser from "../screens/auth/NewUser";
import OtherFormDetails from "../screens/auth/OtherFormDetails";
import ResetPassword from "../screens/auth/ResetPassword";
import Call from "../screens/call.screen";
import SupportChat from "../screens/chat/SupportChat";
import Notifications from "../screens/drawer/Notifications";
import Notification from "../screens/Notification";
import EditProfile from "../screens/tab-bar/EditProfile";
import ViewAppointment from "../screens/ViewAppointment";
import ViewReport from "../screens/ViewReport";
import {RootState} from "../types/redux.type";
import whichSignedUser from "../utils/whichSignedUser";
import DrawerNav from "./drawer.navigation";
import {INavigateProps} from "../interfaces";

export const Stack = createNativeStackNavigator();

const StackNav = memo(() => {
	const dispatch = useDispatch();
	const navigationContainerRef = useNavigationContainerRef();
	const {reset, navigate} = useNavigation<{
		navigate: INavigateProps;
		reset: (state: {index: number; routes: {name: string}[]}) => void;
	}>();

	const {is_signed} = useSelector((state: RootState) => state.isSigned);

	useEffect(() => {
		const unsubscrbe = notifee.onForegroundEvent(async ({type, detail}) => {
			if (
				type === EventType.ACTION_PRESS &&
				detail.pressAction?.id === "call"
			) {
				navigate("call", {
					channel: detail.notification?.data?.channel,
					username: detail.notification?.data?.username,
					uid: detail.notification?.data?.uid,
				});
				await notifee.decrementBadgeCount();
				await notifee.cancelNotification(detail.notification.id);
			}
			if (
				type === EventType.ACTION_PRESS &&
				detail.pressAction?.id === "others"
			) {
				navigate("notifications");
				await notifee.decrementBadgeCount();
				await notifee.cancelNotification(detail.notification.id);
			}
		});

		return () => unsubscrbe();
	}, []);

	useEffect(() => {
		const unsubscribe = notifee.onBackgroundEvent(
			async ({type, detail}) => {
				if (
					type === EventType.ACTION_PRESS &&
					detail.pressAction?.id === "call"
				) {
					navigate("notifications");
					notifee.decrementBadgeCount();
					await notifee.cancelNotification(detail.notification.id);
				}
				if (
					type === EventType.ACTION_PRESS &&
					detail.pressAction?.id === "others"
				) {
					navigate("notifications");
					notifee.decrementBadgeCount();
					await notifee.cancelNotification(detail.notification.id);
				}
			},
		);
		return unsubscribe;
	}, []);

	useEffect(() => {
		(async function () {
			const signedValue = await AsyncStorage.getItem("is_signed");
			const user = await whichSignedUser();
			if (user === "client") {
				const client_data: IClientData = JSON.parse(
					await AsyncStorage.getItem("user_data"),
				);
				dispatch(getClientData(client_data));
			}
			if (user === "provider") {
				const provider_data: IProviderData = JSON.parse(
					await AsyncStorage.getItem("provider_data"),
				);
				dispatch(getProviderData(provider_data));
			}
			if (signedValue === null) {
				dispatch(isSigned(signedValue));
				if (navigationContainerRef.isReady()) {
					reset({index: 0, routes: [{name: "new_users"}]});
				}
			}
			if (signedValue === "no") {
				dispatch(isSigned(signedValue));
				if (navigationContainerRef.isReady()) {
					reset({index: 0, routes: [{name: "login"}]});
				}
			}
			if (signedValue === "yes") {
				dispatch(isSigned(signedValue));
				if (navigationContainerRef.isReady()) {
					reset({index: 0, routes: [{name: "drawer_nav"}]});
				}
			}
		})();
	}, [dispatch, navigationContainerRef, reset]);

	if (is_signed === undefined) {
		return <ActivityLoader />;
	}

	return (
		<ErrorBoundary>
			<Stack.Navigator
				initialRouteName={
					is_signed === null
						? "new_users"
						: is_signed === "yes"
						? "drawer"
						: "login"
				}
				screenOptions={{headerShown: false}}>
				{/* === Auth Routes === */}
				<Stack.Screen
					options={{animation: "flip"}}
					name="new_users"
					component={NewUser}
				/>
				<Stack.Screen
					options={{animation: "slide_from_right"}}
					name="other_form_details"
					component={OtherFormDetails}
				/>
				<Stack.Screen
					name="login"
					options={{
						animation: "slide_from_left",
					}}
					component={Login}
				/>
				<Stack.Screen
					name="forgot_password"
					options={{
						animation: "slide_from_left",
					}}
					component={ForgotPassword}
				/>
				<Stack.Screen
					name="reset_password"
					options={{
						animation: "slide_from_left",
					}}
					component={ResetPassword}
				/>

				<Stack.Screen name={"drawer"} component={DrawerNav} />
				<Stack.Group key={"others"}>
					<Stack.Screen name={"call"} component={Call} />

					<Stack.Screen name="edit_profile" component={EditProfile} />
					{/* === Notification === */}
					<Stack.Screen
						name="notification"
						component={Notification}
					/>
					{/* === END === */}

					{/* === Notification === */}
					<Stack.Screen
						name="notifications"
						component={Notifications}
					/>
					{/* === END === */}

					{/* === Time Slot === */}
					<Stack.Screen name="support_chat" component={SupportChat} />
					<Stack.Screen
						name="view_appointment"
						component={ViewAppointment}
					/>
					<Stack.Screen name="view_report" component={ViewReport} />
				</Stack.Group>
			</Stack.Navigator>
		</ErrorBoundary>
	);
});

export default StackNav;
