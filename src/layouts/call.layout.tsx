import React, {memo, ReactNode} from "react";
import {
	ImageBackground,
	SafeAreaView,
	StatusBar,
	StyleSheet,
} from "react-native";
import {HEIGHT} from "../utils/dim";

const CallLayout = memo(({children}: {children: ReactNode}) => {
	return (
		<SafeAreaView style={styles.root}>
			<StatusBar
				translucent
				barStyle={"light-content"}
				backgroundColor={"transparent"}
			/>
			<ImageBackground
				style={styles.container}
				source={require("../assets/images/call-bg.jpg")}>
				{children}
			</ImageBackground>
		</SafeAreaView>
	);
});

export default CallLayout;
const styles = StyleSheet.create({
	root: {flex: 1},
	container: {
		flex: 1,
		height: HEIGHT,
		justifyContent: "center",
		// alignItems: "center",
	},
});
