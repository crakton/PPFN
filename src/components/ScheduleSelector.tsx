import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React from 'react';
import { ScheduleSelectorProps, ScheduleElementProps } from '../interfaces';
import { style } from '../constants/style';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export function ScheduleElement({
	text,
	selected,
	setSelectedTimeFrame,
}: ScheduleElementProps) {
	return (
		<TouchableOpacity
			style={
				selected
					? styles.activeScheduleElementContainer
					: styles.scheduleElementContainer
			}
			onPress={() => {
				setSelectedTimeFrame(text);
			}}>
			<Text
				style={{
					color: selected ? style.cardColor : style.primaryColor,
					fontFamily: 'AltonaSans-Regular',
					fontWeight: '500',
				}}>
				{text}
			</Text>
			<MCIcon
				size={19}
				color="white"
				name={selected ? 'cards-heart' : 'cards-heart-outline'}
			/>
		</TouchableOpacity>
	);
}

export default function ScheduleSelector({
	timeFrameList,
	selectedTimeFrame,
	setSelectedTimeFrame,
}: ScheduleSelectorProps) {
	return (
		<View>
			<Text
				style={{
					color: style.primaryColor,
					fontFamily: 'AltonaSans-Regular',
					fontSize: 20,
					fontWeight: '500',
					margin: 10,
				}}>
				Time schedule
			</Text>
			<View style={{ borderRadius: 25, overflow: 'hidden' }}>
				{timeFrameList.map((item: string, i: number) => (
					<ScheduleElement
						key={i}
						text={item}
						selected={item === selectedTimeFrame}
						setSelectedTimeFrame={setSelectedTimeFrame}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	scheduleElementContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
		marginVertical: 3,
		backgroundColor: '#c7c2d9',
	},
	activeScheduleElementContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
		marginVertical: 3,
		backgroundColor: '#ea5e4a',
		fontWeight: 'bold',
	},
});
