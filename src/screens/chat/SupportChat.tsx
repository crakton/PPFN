import {memo, useEffect, useState} from "react";
import KommunicateChat from "react-native-kommunicate-chat";
import {useNavigation} from "@react-navigation/native";
import {BackHandler, SafeAreaView, StyleSheet} from "react-native";
import {kommunicate_appid} from "@env";
import {style} from "../../constants/style";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux.type";
import ActivityLoader from "../../components/ActivityLoader";
const SupportChat = () => {
	const {goBack} = useNavigation();
	const {client_data} = useSelector((state: RootState) => state.userData);
	useEffect(() => {
		console.log("km chat init");
		const config = {
			appId: kommunicate_appid,
			isSingleConversation: true,
			displayName: `${client_data.first_name} ${client_data.last_name}`,
			userName: `${client_data.first_name} ${client_data.last_name}`,
			userId: `${client_data.first_name} ${client_data.last_name}`,
		};
		KommunicateChat.buildConversation(
			config,
			(res: string, msg: string | number) => {
				if (res === "Success") {
					console.log("Initiate commnunication", +msg);
				}
			},
		);
	}, [client_data.first_name, client_data.last_name]);
	useEffect(() => {
		const exitSupportChat = () =>
			KommunicateChat.logout((res: string) => {
				if (res === "Success") {
					console.log("Support finish");
				} else {
					console.error("Error occured");
				}
			});
		goBack();
		const exit = BackHandler.addEventListener(
			"hardwareBackPress",
			exitSupportChat,
		);
		return () => exit.remove();
	}, [goBack]);
	return (
		<SafeAreaView style={{flex: 1}}>
			<ActivityLoader />
		</SafeAreaView>
	);
};

export default memo(SupportChat);

const styles = StyleSheet.create({
	customerBtn: {
		backgroundColor: style.highlight,
		padding: 10,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	customerSupport: {
		padding: 20,
	},
	text: {
		color: style.primaryColor,
		fontWeight: "400",
		fontFamily: "AltonaSans-Italic",
		fontSize: 16,
		lineHeight: 20,
	},
});
