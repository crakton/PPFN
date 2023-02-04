import React, {useRef} from "react";
import {SafeAreaView, Text, TouchableOpacity} from "react-native";
import PagerView from "react-native-pager-view";
import Animated from "react-native-reanimated";
import {style} from "../constants/style";
import About from "../screens/about/About";
import CoreValues from "../screens/about/CoreValues";
import Services from "../screens/about/Services";

export function SwipableTab() {
	const pagerRef = useRef<PagerView>(null);
	return (
		<SafeAreaView style={{flex: 1}}>
			<PagerView
				ref={pagerRef}
				pageMargin={10}
				orientation={"horizontal"}>
				<About key={1} />
				<CoreValues key={2} />
				<Services key={3} />
			</PagerView>
		</SafeAreaView>
	);
}
