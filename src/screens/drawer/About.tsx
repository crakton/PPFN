import React, {memo} from "react";
import {SafeAreaView} from "react-native";
import {HeaderWithBackButton} from "../../components/HeaderWithBackButton";
import {SwipableTab} from "../../navigations/swipable-tabs.navigation";

const About = memo(() => {
	return (
		<SafeAreaView style={{flex: 1}}>
			<HeaderWithBackButton goback headerTitle="About Us" />
			<SwipableTab />
		</SafeAreaView>
	);
});

export default About;
