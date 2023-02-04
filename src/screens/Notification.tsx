import {RouteProp, useRoute} from "@react-navigation/native";
import React, {memo} from "react";
import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

import {HeaderWithBackButton} from "../components/HeaderWithBackButton";
import {style} from "../constants/style";

const Notification = memo(() => {
	
	const {
		params: {props},
	}: RouteProp<{name: string; time: string; fullMsg: string}> = useRoute();

	return (
		<SafeAreaView>
			<HeaderWithBackButton goback />
			<View style={{padding: 10}}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
					}}>
					<View>
						<Text
							style={{
								fontSize: 20,
								fontFamily: "AltonaSans-Regular",
								fontWeight: "600",
								color: style.primaryColor,
								letterSpacing: 1,
							}}>
							{props?.name}
						</Text>
						<Text
							style={{
								color: style.titleColor,
								fontWeight: "500",
							}}>
							{props?.time}
						</Text>
					</View>
					<View>
						<TouchableOpacity
							style={{
								backgroundColor: style.cardColor,
								padding: 5,
								borderRadius: 100,
							}}>
							<MCIcon
								name="delete"
								size={20}
								color={style.secondaryColor}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View>
					<Text
						style={{
							lineHeight: 24,
							textAlign: "justify",
							fontWeight: "500",
							fontSize: 18,
							fontFamily: "AltonaSans-Regular",
							letterSpacing: 2,
							padding: 5,
						}}>
						{props?.fullMsg}
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
});

export default Notification;
