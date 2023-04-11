import notifee, {
	AndroidImportance,
	AndroidVisibility,
	EventType,
} from '@notifee/react-native';

class NotifeeServices {
	protected async callChannelId() {
		try {
			return await notifee.createChannel({
				id: 'call',
				visibility: AndroidVisibility.PUBLIC,
				importance: AndroidImportance.HIGH,
				name: 'incoming calls',
				sound: 'cell',
			});
		} catch (error) {
			console.error('Error creating call channel');
		}
	}
	protected async messagesChannelId() {
		try {
			return await notifee.createChannel({
				id: 'messages',
				visibility: AndroidVisibility.PUBLIC,
				importance: AndroidImportance.HIGH,
				name: 'messages',
				sound: 'notifee',
			});
		} catch (error) {
			console.error('Error creating messages channel');
		}
	}
	protected async generalChannelID() {
		try {
			return await notifee.createChannel({
				id: 'others',
				visibility: AndroidVisibility.PUBLIC,
				importance: AndroidImportance.HIGH,
				name: 'other notifications',
				sound: 'notifee',
			});
		} catch (error) {
			console.error('Error creating call channel');
		}
	}
	async displayCallNofication(
		title: string | undefined,
		body: string | undefined,
		data: {[key: string]: string | number} | undefined,
	) {
		await notifee.displayNotification({
			title,
			body,
			data,
			android: {
				actions: [
					{
						title: '<p>Join &#9989;</p>',
						pressAction: {
							id: 'call',
							launchActivity: 'default',
						},
					},
				],
				// asForegroundService: true,
				color: '#442d72',
				channelId: await this.callChannelId(),
				timestamp: Date.now(),
				showTimestamp: true,
				sound: 'cell',
			},
		});
	}
	async displayMessagesNofication(
		title: string | undefined,
		body: string | undefined,
		data: {[key: string]: string | number} | undefined,
	) {
		await notifee.displayNotification({
			title,
			body,
			data,
			android: {
				actions: [
					{
						title: 'Reply',
						pressAction: {
							id: 'messages',
							launchActivity: 'default',
						},
					},
				],
				// asForegroundService: true,
				color: '#442d72',
				channelId: await this.messagesChannelId(),
				timestamp: Date.now(),
				showTimestamp: true,
				sound: 'notifee',
			},
		});
	}
	async displayOtherNofication(
		title: string | undefined,
		body: string | undefined,
		data: {[key: string]: string | number} | undefined,
	) {
		await notifee.displayNotification({
			title,
			body,
			data,
			android: {
				actions: [
					{
						title: 'Preview',
						pressAction: {
							id: 'others',
							launchActivity: 'default',
						},
					},
				],
				color: '#442d72',
				channelId: await this.generalChannelID(),
				timestamp: Date.now(),
				showTimestamp: true,
				sound: 'notifee',
			},
		});
	}

	registerForegroundNotification() {
		notifee.registerForegroundService(() => {
			return new Promise(() => {
				notifee.onForegroundEvent(async ({type, detail}) => {
					if (
						type === EventType.ACTION_PRESS &&
						detail.pressAction?.id === 'stop'
					) {
						await notifee.stopForegroundService();
					}
				});
			});
		});
	}
}

const notifeeServices = new NotifeeServices();
export default notifeeServices;
