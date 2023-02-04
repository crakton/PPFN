import React from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import FeIcon from 'react-native-vector-icons/FontAwesome';
import IIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {style, styles} from '../constants/style';
import {INavigateProps} from '../interfaces';

const DrawerItemsIcon = [
	{
		name: 'Home',
		icon: (iconsStyle: string) => (
			<FaIcon name="home" size={24} color={iconsStyle} />
		),
		uri: '',
	},
	{
		name: 'PPFN Website',
		icon: (iconsStyle: string) => (
			<MCIcon name="web" size={24} color={iconsStyle} />
		),
		uri: 'https://www.ppfn.org/',
	},
	{
		name: 'CLHE Training',
		icon: (iconsStyle: string) => (
			<IIcon name="person" size={24} color={iconsStyle} />
		),
		uri: 'https://youthconnect.ppfn.org/clhe-training-course/',
	},
];

export function DrawerMainNav(
	navigate: INavigateProps,
	index: number,
	routeNames: string[]
) {
	return (
		<View style={{marginHorizontal: 2}}>
			{DrawerItemsIcon.map(({icon, name, uri}, idx) => {
				const isFocused = idx === index;
				return (
					<TouchableOpacity
						key={Math.floor(Math.random() * idx) + name}
						onPress={() =>
							idx === 0 ? navigate(routeNames[idx]) : Linking.openURL(uri)
						}
						style={[
							styles.drawerNavItems,
							{
								backgroundColor: isFocused ? style.highlight : 'transparent',
							},
						]}
					>
						{icon(isFocused ? style.primaryColor : style.highlight)}
						<Text
							style={{
								marginLeft: 10,
								fontSize: 16,
								fontWeight: isFocused ? '500' : 'normal',
								color: isFocused ? style.primaryColor : style.highlight,
							}}
						>
							{name}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
