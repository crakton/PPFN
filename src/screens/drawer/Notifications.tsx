import { useNavigation } from '@react-navigation/native';
import React, { memo, useState } from 'react';
import {
	FlatList,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { HeaderWithBackButton } from '../../components/HeaderWithBackButton';
import SetFetchType from '../../components/SetFetchType';
import { notifications } from '../../constants/notifications';
import { notificationsFetchTypes } from '../../constants/staticMenus';
import { style } from '../../constants/style';
import { INavigateProps, INotifications } from '../../interfaces';

const Notifications = memo(() => {
	const [fetchType, setFetchType] = useState(notificationsFetchTypes[0]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HeaderWithBackButton goback />
			<ScrollView style={{ paddingHorizontal: 15 }}>
				<Text
					style={{ color: style.primaryColor, fontFamily: 'AltonaSans-Regular', fontWeight: '500', fontSize: 24 }}>
					Notifications
				</Text>
				<View style={{ marginTop: 20, paddingHorizontal: 15 }}>
					<SetFetchType
						fetchTypes={notificationsFetchTypes}
						activeFetchType={fetchType}
						setFetchType={setFetchType}
					/>
				</View>
				{fetchType === 'Unread' && (
					<ScrollView horizontal contentContainerStyle={{ flex: 1 }}>
						{/*avoid virtualizelist inside scrollview breakage*/}
						<UnReadNotification />
					</ScrollView>
				)}
			</ScrollView>
		</SafeAreaView>
	);
});

const NotificationList = memo(function(props) {
	const {
		time,
		message,
		name,
	}: { name: string; time: string; message: string } | any = props;
	const { navigate }: { navigate: INavigateProps } = useNavigation();
	return (
		<TouchableOpacity
			style={styles.notifyContainer}
			key={time}
			onPress={() => navigate('notification', { props })}>
			<View style={styles.iconContainer}>
				<MCIcon
					name="bell-badge-outline"
					color={style.secondaryColor}
					size={18}
				/>
			</View>
			<View style={styles.notifyDetails}>
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.msg}>{message.slice(0, 27).concat(' ...')}</Text>

				<Text style={styles.time}>{time}</Text>
			</View>
		</TouchableOpacity>
	);
});

const UnReadNotification = memo(function() {
	function renderNotifications({ item }: { item: INotifications }) {
		return <NotificationList {...item} />;
	}
	return (
		<FlatList
			data={notifications.unread}
			renderItem={renderNotifications}
			keyExtractor={(_, idx) => idx.toString()}
		/>
	);
});

export default Notifications;
const styles = StyleSheet.create({
	notifyContainer: {
		padding: 10,
		marginVertical: 3,
		backgroundColor: style.cardColor,
		borderRadius: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	iconContainer: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: style.highlight,
		borderWidth: 2,
		borderRadius: 100,
	},
	msg: {
		color: style.black,
		fontSize: 14,
		paddingHorizontal: 10,
	},
	notifyDetails: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		flex: 1,
	},
	name: {
		color: style.primaryColor,
		fontWeight: '600',
		fontSize: 20,
		fontFamily: 'AltonaSans-Regular',
		letterSpacing: 1.3,
		paddingHorizontal: 10,
	},
	time: {
		color: style.titleColor,
		fontSize: 12,
		fontWeight: '500',
		paddingHorizontal: 10,
	},
});
