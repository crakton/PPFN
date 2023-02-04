import React, {memo} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import About from './screens/about/About';
import Services from './screens/about/Services';
import CoreValues from './screens/about/CoreValues';
import {SafeAreaView} from 'react-native';
import {SwipableTab} from './SwipableTab';

const MTab = createMaterialTopTabNavigator();
const TabBarAbout = memo(() => {
	return (
		<SafeAreaView style={{flex: 1, marginTop: 15}}>
			<MTab.Navigator tabBar={props => <SwipableTab {...props} />}>
				<MTab.Screen
					name="about"
					options={{
						title: 'About',
					}}
					component={About}
				/>
				<MTab.Screen
					name="services"
					options={{
						title: 'Services',
					}}
					component={Services}
				/>
				<MTab.Screen
					name="core_values"
					options={{title: 'Core Values'}}
					component={CoreValues}
				/>
			</MTab.Navigator>
		</SafeAreaView>
	);
});

export default TabBarAbout;
