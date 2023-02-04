import React, {memo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {coreValues} from '../../constants/coreValues';
import {style} from '../../constants/style';

const CoreValues = memo(() => {
	return (
		<ScrollView style={{flex: 1, padding: 15}}>
			{coreValues.map(({description, title}, key) => (
				<View
					key={key}
					style={{
						padding: 10,
						flexDirection: 'column',
						justifyContent: 'center',
						backgroundColor: style.highlight,
						borderRadius: 10,
						marginBottom: 20,
					}}>
					<Text style={{fontSize: 18, color: style.primaryColor}}>{title}</Text>
					<Text
						style={{
							color: style.tertiaryColor,
							lineHeight: 20,
							textAlign: 'justify',
						}}>
						{description}
					</Text>
				</View>
			))}
		</ScrollView>
	);
});

export default CoreValues;
