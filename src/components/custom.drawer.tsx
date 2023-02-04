import React, {memo} from "react";
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
} from "@react-navigation/drawer";
import {View} from "react-native";

import {DrawerHeader} from "./drawer.header";
import {DrawerMainNav} from "./drawer.mainnav";
import {DrawerOtherNav} from "./drawer.othernav";
import {style} from "../constants/style";

const CustomDrawerNavigation = memo((props: DrawerContentComponentProps) => {
	const {
		navigation: {navigate},
		state: {index, routeNames},
	} = props;

	return (
		<View style={{flex: 1}}>
			<DrawerHeader />
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{
					backgroundColor: style.primaryColor,
					flex: 1,
				}}>
				{DrawerMainNav(navigate, index, routeNames)}
				{DrawerOtherNav(navigate, index, routeNames)}
			</DrawerContentScrollView>
		</View>
	);
});



export default CustomDrawerNavigation;
