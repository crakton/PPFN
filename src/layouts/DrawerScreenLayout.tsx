import {SafeAreaView, View} from "react-native";
import React, {memo} from "react";
import DrawerScreenTopBar from "../components/DrawerScreenTopBar";
import {DrawerScreenLayoutProps} from "../interfaces";
import { CustomHeader } from "../components/CustomHeader";

function DrawerScreenLayout({
	children,
	title = "",
	subtitle = "",
	rating = null,
}: DrawerScreenLayoutProps) {
	return (
		<SafeAreaView style={{flex: 1}}>
			<CustomHeader/>
			<DrawerScreenTopBar
				title={title}
				subtitle={subtitle}
				rating={rating}
			/>
			<View style={{flex: 1}}>{children}</View>
		</SafeAreaView>
	);
}

export default memo(DrawerScreenLayout);
