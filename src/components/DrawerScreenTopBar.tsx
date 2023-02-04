import React, {memo} from "react";
import {View, Text, StyleSheet} from "react-native";
import {DrawerScreenTopBarProps} from "../interfaces";
import {style} from "../constants/style";
import {StarRating} from "./widgets/StarRating";
import {WIDTH} from "../utils/dim";
function DrawerScreenTopBar({
	title = "",
	subtitle = "",
	rating = null,
}: DrawerScreenTopBarProps) {
	return (
		<View style={styles.headerContainer}>
			{title ? (
				<View
					style={{
						paddingHorizontal: 20,
						marginBottom: 8,
					}}>
					<View
						style={{
							width: WIDTH,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<Text
							style={{
								fontFamily: "AltonaSans-Regular",
								fontWeight: "500",
								fontSize: 24,
								color: style.secondaryColor,
								textTransform: "capitalize",
							}}>
							{title}
						</Text>
						{typeof rating === "number" ? (
							<StarRating rate={rating} max={5} />
						) : null}
					</View>
					{subtitle ? (
						<Text
							style={{
								color: style.titleColor,
								fontFamily: "AltonaSans-Regular",
								fontSize: 18,
								fontWeight: "500",
							}}>
							{subtitle}
						</Text>
					) : null}
				</View>
			) : null}
		</View>
	);
}
export default memo(DrawerScreenTopBar);

export const styles = StyleSheet.create({
	flexRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 2,
		marginHorizontal: 20,
	},
	headerContainer: {
		flexDirection: "column",
		justifyContent: "center",
	},
});
