import React, {memo} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {HeaderWithBackButton} from '../../components/HeaderWithBackButton';
import {faqs} from '../../constants/faqs';
import {style} from '../../constants/style';

const FAQ = memo(() => {
	return (
		<SafeAreaView style={{flex: 1, marginTop: 15}}>
			<HeaderWithBackButton headerTitle="F&Q's" />
			<ScrollView style={{flex: 1, paddingBottom: 20, padding: 15}}>
				{faqs.map(({description, title}, key) => (
					<View
						key={key}
						style={{
							padding: 10,
							flexDirection: 'column',
							justifyContent: 'center',
							backgroundColor: style.highlight,
							marginVertical: 3,
							borderRadius: 10,
						}}>
						<Text style={{fontSize: 16, color: style.primaryColor}}>
							{title}
						</Text>
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
		</SafeAreaView>
	);
});

export default FAQ;
