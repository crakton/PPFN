import {useNavigation} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import {style} from '../constants/style';

export function HeaderWithBackButton({
	goback,
	headerTitle,
	hasOptions,
}: {
	goback?: boolean;
	headerTitle?: string | ReactNode;
	hasOptions?: boolean;
}) {
	const {goBack} = useNavigation();
	return (
		<View style={styles.header}>
			{goback ? (
				<TouchableWithoutFeedback onPress={() => goBack()}>
					<IIcon
						name="arrow-back-sharp"
						color={style.primaryColor}
						size={24}
					/>
				</TouchableWithoutFeedback>
			) : null}
			{headerTitle && typeof headerTitle === 'string' ? (
				<Text style={styles.headerTitle}>{headerTitle}</Text>
			) : (
				headerTitle
			)}

			<View>
				{hasOptions ? (
					<TouchableWithoutFeedback>
						<IIcon name="ellipsis-horizontal-sharp" size={24} />
					</TouchableWithoutFeedback>
				) : null}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 15,
		paddingHorizontal: 20,
		marginBottom: 10,
		// marginTop: 20,
	},
	headerTitle: {
		color: style.tertiaryColor,
		fontFamily: 'AltonaSans-Regular',
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 0.8,
	},
});
