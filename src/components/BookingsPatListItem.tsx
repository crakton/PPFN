import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {memo} from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {INavigateProps, IPatientBookings} from '../interfaces';
import {style} from '../constants/style';
import {Rating} from './widgets/Rating';
import {useNavigation} from '@react-navigation/native';

const BookingsPatListItem = ({
	clinic,
	name,
	picture,
	rating,
	info,
}: IPatientBookings) => {
	const {navigate}: {navigate: INavigateProps} = useNavigation();
	return (
		<View style={styles.container}>
			<View style={styles.imgContainer}>
				<Image style={styles.img} source={{uri: picture}} />
			</View>
			<View style={{flex: 1, marginVertical: 20, flexDirection: 'column'}}>
				<Text
					style={{fontSize: 18, fontWeight: '500', color: style.primaryColor}}>
					{name}
				</Text>
				<Text
					style={{fontSize: 12, fontWeight: '500', color: style.titleColor}}>
					{info}
				</Text>
				<View style={{flexDirection: 'row', marginVertical: 5}}>
					{clinic ? <Text style={styles.clinic}>{clinic}</Text> : null}
				</View>
				<View style={{width: '60%', marginTop: 5}}>
					<Rating rate={rating} max={5} />
				</View>
			</View>
			<View style={{flexDirection: 'column'}}>
				<TouchableOpacity
					onPress={() => navigate('time_slot')}
					style={styles.secondaryBtn}>
					<AntIcon color={style.highlight} size={30} name="calendar" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.primaryBtn}>
					<AntIcon color={style.highlight} size={30} name="phone" />
				</TouchableOpacity>
			</View>
		</View>
	);
};
export default memo(BookingsPatListItem);
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: style.cardColor,
		borderRadius: 15,
		overflow: 'hidden',
		elevation: 3,
	},
	imgContainer: {
		height: 75,
		width: 75,
		overflow: 'hidden',
		borderRadius: 999,
		marginVertical: 15,
		marginHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: style.highlight,
		borderWidth: 2,
	},
	img: {
		height: '100%',
		width: '100%',
	},
	secondaryBtn: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: style.secondaryColor,
		paddingHorizontal: 15,
	},
	primaryBtn: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: style.tertiaryColor,
		paddingHorizontal: 15,
	},
	clinic: {
		fontSize: 12,
		fontWeight: 'bold',
		color: style.secondaryColor,
		backgroundColor: style.highlight,
		flexDirection: 'row',
		padding: 7,
		borderRadius: 5,
	},
});
