import React, {useRef, useState} from "react";
import {View} from "react-native";
import {SafeAreaView, Text, TouchableOpacity} from "react-native";
import PagerView from "react-native-pager-view";
import Animated from "react-native-reanimated";
import {style} from "../constants/style";
import About from "../screens/about/About";
import CoreValues from "../screens/about/CoreValues";
import Services from "../screens/about/Services";

export function SwipableTab() {
	const pagerRef = useRef<PagerView>(null);
	const [infos] = useState(["About PPFN", "Core values", "Services"]);
	const [index, setIndex] = useState(0);

	return (
		<SafeAreaView style={{flex: 1}}>
			<View
				style={{
					marginHorizontal: 15,
					justifyContent: "space-evenly",
					alignItems: "center",
					flexDirection: "row",
				}}>
				{infos.map((info, idx) => (
					<Text
						onPress={() => {
							pagerRef.current?.setPage(idx);
							setIndex(idx);
						}}
						key={info}
						style={{
							flex: 1,
							marginHorizontal: 2,
							color:
								idx === index
									? style.cardColor
									: style.primaryColor,
							backgroundColor:
								idx === index
									? style.primaryColor
									: "transparent",
							padding: 10,
							borderRadius: 5,
						}}>
						{info}
					</Text>
				))}
			</View>
			<PagerView
				onPageSelected={e => setIndex(e.nativeEvent.position)}
				initialPage={0}
				style={{flex: 1}}
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
