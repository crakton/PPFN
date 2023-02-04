import React, { memo } from 'react';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
} from '@react-navigation/drawer';
import { StatusBar, View } from 'react-native';

import { style } from '../constants/style';
import { DrawerHeader } from './DrawerHeader';
import { DrawerMainNav } from './DrawerMainNav';
import { DrawerOtherNav } from './DrawerOtherNav';

const CustomDrawerNavigation = memo((props: DrawerContentComponentProps) => {
	const {
		navigation: { navigate },
		state: { index, routeNames },
	} = props;

	return (
		<View style={{ flex: 1 }}>
			<StatusBar translucent animated backgroundColor={style.primaryColor + 'df'} />
			<DrawerHeader />
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{
					backgroundColor: style.primaryColor,
					flex: 1,
					marginTop: -30,
				}}>
				{DrawerMainNav(navigate, index, routeNames)}
				{DrawerOtherNav(navigate, index, routeNames)}
			</DrawerContentScrollView>
		</View>
	);
});

export default CustomDrawerNavigation;
