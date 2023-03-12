/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';

export function PresenceStatus({status}: {status: boolean | null | undefined}) {
	return (
		<View
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'row',
			}}>
			<View
				style={{
					width: 5,
					height: 5,
					backgroundColor: status ? 'limegreen' : '#999',
					padding: 3.5,
					borderRadius: 100,
				}}
			/>
			<Text
				style={{
					marginLeft: 3,
					color: status ? 'limegreen' : '#999',
					fontSize: 10,
				}}>
				{status && 'online'}
				{!status && 'offline'}
			</Text>
		</View>
	);
}
