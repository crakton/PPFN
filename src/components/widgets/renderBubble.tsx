import React from 'react';
import {Bubble, BubbleProps} from 'react-native-gifted-chat';
import {style} from '../../constants/style';

export default function (props: BubbleProps<any>) {
	return (
		<Bubble
			{...props}
			wrapperStyle={{
				right: {
					backgroundColor: style.primaryColor,
					borderBottomRightRadius: 3,
					borderTopRightRadius: 35,
					paddingRight: 10,
					paddingTop: 10,
				},
				left: {
					backgroundColor: style.cardColor,
					borderBottomLeftRadius: 3,
					borderTopLeftRadius: 35,
					paddingTop: 10,
					paddingLeft: 10,
				},
			}}
			textStyle={{
				right: {
					color: '#fff',
				},
				left: {
					color: '#333',
				},
			}}
		/>
	);
}
