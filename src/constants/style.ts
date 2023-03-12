import {StyleSheet} from "react-native";
export const style = {
	black: "#2B3032",
	cardColor: "#F6F8F9",
	primaryColor: "#39156a",
	secondaryColor: "#5E96CF",
	tertiaryColor: "#5068AE",
	highlight: "#cce3f4",
	titleColor: "#c4c5c5",
};

export const styles = StyleSheet.create({
	drawerHeaderAvatarContainer: {
		position: "relative",
		padding: 10,
		marginTop: 20,
	},
	drawerHeaderAvatar: {
		height: 55,
		width: 55,
		borderRadius: 100,
		borderColor: style.tertiaryColor,
		borderWidth: 2,
	},
	drawerHeaderEditIcon: {
		backgroundColor: style.primaryColor,
		borderRadius: 50,
		width: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
		padding: 5,
		left: 47,
		top: 47,
		position: "absolute",
	},
	drawerHeaderInfoContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
	},
	drawerHeaderInfoText: {
		color: style.primaryColor,
		fontWeight: "600",
		fontSize: 20,
		textTransform: "capitalize",
	},
	drawerOtherNavContainer: {
		top: 30,
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: style.tertiaryColor,
	},
	drawerNavItems: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		marginVertical: 5,
		borderRadius: 5,
	},
});
