import React from 'react';
import {Text} from 'react-native';
import {style} from '../../constants/style';

export default function ({text}: {text: string}) {
	return (
		<Text
			style={{
				color: style.titleColor,
				fontSize: 22,
				fontWeight: '700',
				textAlign: 'center',
			}}>
			{text}
		</Text>
	);
}
