import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {style} from "../../constants/style";

/* === END === */
export const CustomNotificationBadge = ({
	length,
}: {
	length: number | undefined;
}) => (
	<View
		style={{
			width: 15,
			height: 15,
			borderRadius: 50,
			backgroundColor: style.cardColor,
			borderColor: style.primaryColor,
			borderWidth: 0.7,
			justifyContent: "center",
			alignItems: "center",
			...StyleSheet.absoluteFillObject,
			top: 14,
			left: 20,
		}}>
		<Text
			style={{
				fontSize: 10,
				color: style.primaryColor,
			}}>
			{length}
		</Text>
	</View>
);
