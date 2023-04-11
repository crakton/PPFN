/* eslint-disable react-native/no-inline-styles */
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import storage from '@react-native-firebase/storage';

import {INavigateProps} from '../interfaces';
import {style} from '../constants/style';
import {Rating} from './widgets/Rating';
import IListProvider from '../interfaces/listProvider';
import firebaseServices from '../services/firebase.service';
import {PresenceStatus} from './widgets/PresenceStatus';

export default function HomeDoctorListItem({...data}: IListProvider) {
	const {navigate}: {navigate: INavigateProps} = useNavigation();
	const [image, setImage] = useState('');
	const [status, setStatus] = useState<boolean | null>();
	useLayoutEffect(() => {
		firebaseServices.getOnlineStatus(
			`@${data.last_name.trim()}${data.id}`,
			val => {
				setStatus(val);
			},
		);
	}, [data.id, data.last_name]);
	useEffect(() => {
		(async () => {
			try {
				const img = await storage()
					.ref(`profile_images/@${data?.id}${data?.first_name}`)
					.getDownloadURL();
				setImage(img);
			} catch (error) {
				console.error(error);
			}
		})();
	}, [data]);
	return (
		<View style={styles.container}>
			<View style={styles.imgContainer}>
				<Image
					style={styles.img}
					source={
						image
							? {uri: image}
							: require('../assets/images/logo.png')
					}
				/>
			</View>
			<View
				style={{flex: 1, marginVertical: 20, flexDirection: 'column'}}>
				<Text
					style={{
						fontSize: 18,
						fontWeight: 'bold',
						textTransform: 'capitalize',
						color: style.primaryColor,
					}}>
					{data.first_name} {data.last_name}
				</Text>
				{data.experience ? (
					<Text
						style={{
							fontSize: 12,
							fontWeight: '500',
							color: style.titleColor,
						}}>
						{data.experience} years experience
					</Text>
				) : null}
				<View style={{flexDirection: 'row', marginVertical: 5}}>
					<Text style={styles.clinic}>{data.facility}</Text>
				</View>
				<View style={{width: '60%', marginTop: 5}}>
					{data.rating ? <Rating rate={data.rating} max={5} /> : null}
				</View>
			</View>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingHorizontal: 5,
				}}>
				{status ? (
					<Text style={{color: 'limegreen', fontSize: 10}}>
						online
					</Text>
				) : (
					<PresenceStatus status={status} />
				)}
			</View>
			<View style={{flexDirection: 'column'}}>
				<TouchableOpacity
					onPress={() => navigate('doctor_appointment', data)}
					style={styles.secondaryBtn}>
					<AntIcon
						color={style.highlight}
						size={30}
						name="calendar"
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: style.cardColor,
		borderRadius: 15,
		overflow: 'hidden',
		elevation: 3,
		marginVertical: 5,
	},
	imgContainer: {
		height: 55,
		width: 55,
		overflow: 'hidden',
		borderRadius: 100,
		marginVertical: 15,
		marginHorizontal: 10,
	},
	img: {
		width: 55,
		height: 55,
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
