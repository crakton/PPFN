import {useNavigation} from "@react-navigation/native";
import React, {memo, ReactNode, useCallback, useState} from "react";
import {
	FlatList,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {useDispatch, useSelector} from "react-redux";

import {HeaderWithBackButton} from "../../components/HeaderWithBackButton";
import SetFetchType from "../../components/SetFetchType";
import {notifications} from "../../constants/notifications";
import {notificationsFetchTypes} from "../../constants/staticMenus";
import {style} from "../../constants/style";
import {INavigateProps, INotifications} from "../../interfaces";
import {
	deleteAppointmentNotification,
	deleteCallNotification,
	deleteReportNotification,
	updateAppointmentNotification,
	updateCallNotification,
	updateReportNotification,
} from "../../redux/notifications";
import {RootState} from "../../types/redux.type";
import {CustomNotificationBadge} from "../../components/widgets/CustomNotificationBadge";
import {WIDTH} from "../../utils/dim";
import {RippleButton} from "../../components/widgets/RippleButton";
import DefaultText from "../../components/widgets/DefaultText";

const Notifications = memo((props: any) => {
	return (
		<View style={{flex: 1}}>
			<HeaderWithBackButton goback />
			<PagerView style={{flex: 1}} initialPage={0}>
				<CallNotifications {...props.params} key={1} />
				<AppointmentNotifications key={2} />
				<ReportNotifications key={3} />
			</PagerView>
		</View>
	);
});

const NotificationList = memo(function ({
	body,
	title,
	actionBtns,
	channel,
	uid,
	username,
}: {
	body: string | undefined;
	title: string | undefined;
	channel?: string | undefined;
	uid?: string | undefined;
	username?: string | string;
	actionBtns: ReactNode;
}) {
	return (
		<View style={styles.notifyContainer}>
			<View style={styles.iconContainer}>
				<MCIcon
					name="bell-badge-outline"
					color={style.tertiaryColor}
					size={18}
				/>
			</View>
			<View style={styles.notifyDetails}>
				<Text style={styles.name}>{title}</Text>
				<Text style={styles.msg}>
					{/* {message.slice(0, 27).concat(" ...")} */}
					{body}
				</Text>

				{/* <Text style={styles.time}>{time}</Text> */}
			</View>
			<View
				style={{
					justifyContent: "center",
					flexDirection: "row",
					position: "relative",
				}}>
				{actionBtns}
			</View>
		</View>
	);
});

/* === CALL NOTIFICATION COMPONENT */
const CallNotifications = memo(function (props: any) {
	const {calls} = useSelector(
		(state: RootState) => state.notifications.notificatons,
	);
	const [fetchType, setFetchType] = useState(notificationsFetchTypes[0]);
	const {navigate}: {navigate: INavigateProps} = useNavigation();
	const dispatch = useDispatch();

	const handleJoinCall = useCallback((prop: any) => {
		navigate("call", {...prop});
		dispatch(updateCallNotification(prop.index));
	}, []);
	const handleDelete = useCallback((index: number) => {
		dispatch(deleteCallNotification(index));
	}, []);

	function renderNotifications(item: {
		body: string | undefined;
		channel: string | undefined;
		title: string | undefined;
		index: number;
		uid: string | undefined;
		username: string | undefined;
	}) {
		return (
			<NotificationList
				{...item}
				actionBtns={
					fetchType === "Unread" && calls.unread?.length ? (
						<RippleButton onPress={() => handleJoinCall({...item})}>
							<MCIcon
								name={"phone-plus"}
								size={22}
								color={style.primaryColor}
							/>
						</RippleButton>
					) : (
						<RippleButton onPress={() => handleDelete(item.index)}>
							<MCIcon
								name={"delete"}
								size={22}
								color={style.primaryColor}
							/>
						</RippleButton>
					)
				}
			/>
		);
	}
	return (
		<>
			<SafeAreaView style={{flex: 1}}>
				<Text
					style={{
						color: style.primaryColor,
						fontFamily: "AltonaSans-Regular",
						fontWeight: "500",
						fontSize: 24,
						paddingHorizontal: 15,
					}}>
					Call Notifications
				</Text>

				<View style={{marginTop: 20, paddingHorizontal: 15}}>
					<SetFetchType
						fetchTypes={notificationsFetchTypes}
						activeFetchType={fetchType}
						setFetchType={setFetchType}
					/>
					{fetchType === "Unread" && calls.unread?.length ? (
						<CustomNotificationBadge length={calls.unread.length} />
					) : null}
				</View>
				{fetchType === "Unread" ? (
					calls.unread?.length ? (
						<FlatList
							data={calls.unread}
							renderItem={({item, index}) =>
								renderNotifications({...item, index})
							}
							keyExtractor={(_, idx) => idx.toString()}
						/>
					) : (
						<DefaultText text={"No new notificatons"} />
					)
				) : null}
				{fetchType === "Read" ? (
					calls.read?.length ? (
						<FlatList
							data={calls.read}
							renderItem={({item, index}) =>
								renderNotifications({...item, index})
							}
							keyExtractor={(_, idx) => idx.toString()}
						/>
					) : (
						<DefaultText text={"No new notificatons"} />
					)
				) : null}
			</SafeAreaView>
		</>
	);
});
/* === END === */

/* === APPOINTMENT NOTIFICATION COMPONENT */
const AppointmentNotifications = memo(function () {
	const {appointments} = useSelector(
		(state: RootState) => state.notifications.notificatons,
	);
	const [fetchType, setFetchType] = useState(notificationsFetchTypes[0]);

	const {navigate}: {navigate: INavigateProps} = useNavigation();
	const dispatch = useDispatch();

	const handleRead = useCallback((prop: any) => {
		navigate("appointments");
		dispatch(updateAppointmentNotification(prop.index));
	}, []);
	const handleDelete = useCallback((index: number) => {
		dispatch(deleteAppointmentNotification(index));
	}, []);

	function renderNotifications(item: {
		body: string | undefined;
		title: string | undefined;
		index: number;
	}) {
		return (
			<NotificationList
				{...item}
				actionBtns={
					fetchType === "Unread" && appointments.unread?.length ? (
						<RippleButton onPress={() => handleRead({...item})}>
							<MCIcon
								name={"eye"}
								size={22}
								color={style.primaryColor}
							/>
						</RippleButton>
					) : (
						<RippleButton onPress={() => handleDelete(item.index)}>
							<MCIcon
								name={"delete"}
								size={22}
								color={style.primaryColor}
							/>
						</RippleButton>
					)
				}
			/>
		);
	}
	return (
		<>
			<SafeAreaView style={{flex: 1}}>
				<Text
					style={{
						color: style.primaryColor,
						fontFamily: "AltonaSans-Regular",
						fontWeight: "500",
						fontSize: 24,
						paddingHorizontal: 15,
					}}>
					Appointment Notifications
				</Text>

				<View style={{marginTop: 20, paddingHorizontal: 15}}>
					<SetFetchType
						fetchTypes={notificationsFetchTypes}
						activeFetchType={fetchType}
						setFetchType={setFetchType}
					/>
					{fetchType === "Unread" && appointments.unread?.length ? (
						<CustomNotificationBadge
							length={appointments.unread.length}
						/>
					) : null}
				</View>
				{fetchType === "Unread" ? (
					appointments.unread?.length ? (
						<FlatList
							data={appointments.unread}
							renderItem={({item, index}) =>
								renderNotifications({...item, index})
							}
							keyExtractor={(_, idx) => idx.toString()}
						/>
					) : (
						<DefaultText text={"No new notificatons"} />
					)
				) : null}
				{fetchType === "Read" ? (
					appointments.read?.length ? (
						<FlatList
							data={appointments.read}
							renderItem={({item, index}) =>
								renderNotifications({...item, index})
							}
							keyExtractor={(_, idx) => idx.toString()}
						/>
					) : (
						<DefaultText text={"No new notificatons"} />
					)
				) : null}
			</SafeAreaView>
		</>
	);
});
/* === REPORT NOTIFICATION COMPONENT */
const ReportNotifications = memo(function () {
	const {reports} = useSelector(
		(state: RootState) => state.notifications.notificatons,
	);
	console.log("unread", reports.unread);

	const [fetchType, setFetchType] = useState(notificationsFetchTypes[0]);

	const {navigate}: {navigate: INavigateProps} = useNavigation();
	const dispatch = useDispatch();

	const handleRead = useCallback((prop: any) => {
		navigate("reports", {...prop});
		dispatch(updateReportNotification(prop.index));
	}, []);

	const handleDelete = useCallback((index: number) => {
		dispatch(deleteReportNotification(index));
	}, []);

	function renderNotifications(
		item: {
			body: string | undefined;
			title: string | undefined;
			index: number;
		},
		// id: number,
	) {
		return (
			<NotificationList
				{...item}
				actionBtns={
					fetchType === "Unread" && reports.unread?.length ? (
						<RippleButton onPress={() => handleRead({...item})}>
							<MCIcon
								name={"eye"}
								size={22}
								color={style.primaryColor}
							/>
						</RippleButton>
					) : (
						<RippleButton onPress={() => handleDelete(item.index)}>
							<MCIcon
								name={"delete"}
								size={22}
								color={style.primaryColor}
							/>
						</RippleButton>
					)
				}
			/>
		);
	}
	return (
		<>
			<SafeAreaView style={{flex: 1}}>
				<Text
					style={{
						color: style.primaryColor,
						fontFamily: "AltonaSans-Regular",
						fontWeight: "500",
						fontSize: 24,
						paddingHorizontal: 15,
					}}>
					Reports Notifications
				</Text>

				<View
					style={{
						marginTop: 20,
						paddingHorizontal: 15,
						position: "relative",
					}}>
					<SetFetchType
						fetchTypes={notificationsFetchTypes}
						activeFetchType={fetchType}
						setFetchType={setFetchType}
					/>
					{fetchType === "Unread" && reports.unread?.length ? (
						<CustomNotificationBadge
							length={reports.unread.length}
						/>
					) : null}
				</View>
				{fetchType === "Unread" ? (
					reports.unread?.length ? (
						<FlatList
							data={reports.unread}
							renderItem={({item, index}) =>
								renderNotifications({...item, index})
							}
							keyExtractor={(_, idx) => idx.toString()}
						/>
					) : (
						<DefaultText text={"No new notificatons"} />
					)
				) : null}
				{fetchType === "Read" ? (
					reports.read?.length ? (
						<FlatList
							data={reports.read}
							renderItem={({item, index}) =>
								renderNotifications({...item, index})
							}
							keyExtractor={(_, idx) => idx.toString()}
						/>
					) : (
						<DefaultText text={"No new notificatons"} />
					)
				) : null}
			</SafeAreaView>
		</>
	);
});
/* === END === */

export default Notifications;
const styles = StyleSheet.create({
	notifyContainer: {
		padding: 10,
		marginVertical: 3,
		marginHorizontal: 15,
		backgroundColor: style.cardColor,
		borderRadius: 10,
		flexDirection: "row",
		position: "relative",
		alignItems: "center",
		flex: 1,
	},
	iconContainer: {
		width: 35,
		height: 35,
		justifyContent: "center",
		alignItems: "center",
		borderColor: style.tertiaryColor,
		borderWidth: 1,
		borderRadius: 100,
	},
	msg: {
		color: style.black,
		fontSize: 14,
		paddingHorizontal: 10,
	},
	notifyDetails: {
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "space-between",
		flex: 1,
	},
	name: {
		color: style.primaryColor,
		fontWeight: "600",
		fontSize: 20,
		fontFamily: "AltonaSans-Regular",
		letterSpacing: 1.3,
		paddingHorizontal: 10,
	},
	time: {
		color: style.titleColor,
		fontSize: 12,
		fontWeight: "500",
		paddingHorizontal: 10,
	},
});
