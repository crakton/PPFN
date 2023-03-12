/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import EmojiPicker from 'rn-emoji-keyboard';

import {RouteProp, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FaIcon from 'react-native-vector-icons/FontAwesome';

//types and interfaces
import IClientData from '../../interfaces/clientData';
import IProviderData from '../../interfaces/providerData';
import {RootState} from '../../types/redux.type';

//components
import ActivityLoader from '../../components/widgets/ActivityLoader';

//utils
import whichSignedUser from '../../utils/whichSignedUser';
import generateUUID from '../../utils/generateUUID';
import IListProvider from '../../interfaces/listProvider';
import renderBubble from '../../components/widgets/renderBubble';
import {style} from '../../constants/style';
import {ImageBackground} from 'react-native';
import {EmojiType} from 'rn-emoji-keyboard/lib/typescript/src/types';

export default function Chat() {
	const {params} =
		useRoute<RouteProp<{params: IClientData | IListProvider}>>();
	const [data, setData] = useState<IClientData | IProviderData>();
	const [showEmojis, setShowEmojis] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [message, setMessage] = useState('');
	const [uidRef, setUidRef] = useState('');
	const [image, setImage] = useState('');

	const {client_data, provider_data} = useSelector(
		(state: RootState) => state.userData,
	);

	useEffect(() => {
		const unsubcribe = firestore()
			.collection('Chats')
			.doc(uidRef)
			.collection('messages')
			.orderBy('createdAt', 'desc')
			.onSnapshot(snapshot => {
				if (!snapshot.empty) {
					setMessages(snapshot.docs.map(doc => doc.data()));
				}
			});
		return unsubcribe;
	}, [uidRef]);
	const handleSend = useCallback(() => {
		if (message && uidRef) {
			firestore()
				.collection('Chats')
				.doc(uidRef)
				.collection('messages')
				.add({
					_id: generateUUID(),
					text: message.trim(),
					createdAt: Date.now(),
					user: {
						_id: data?.id,
						name: `${data?.first_name} ${data?.last_name}`,
						avatar: image
							? image
							: 'https://placeimg.com/140/140/people',
					},
				});
			setMessage('');
		}
		return;
	}, [data?.first_name, data?.id, data?.last_name, image, message, uidRef]);
	const getWhichUser = useCallback(async () => {
		try {
			const user = await whichSignedUser();
			if (user === 'client') {
				setData(client_data);
				setUidRef(`@${params.last_name}${client_data.last_name}`);
			} else {
				setData(provider_data);
				setUidRef(`@${provider_data.last_name}${params.last_name}`);
			}
		} catch (error) {
			console.log(error);
		}
	}, [client_data, provider_data, params]);

	useLayoutEffect(() => {
		getWhichUser();
	}, [getWhichUser]);

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

	const onEmojiSelected = useCallback((emoji: EmojiType) => {
		console.log(emoji.emoji);

		setMessage(prevMessage => prevMessage.concat(` ${emoji.emoji} `));
	}, []);

	const handleEmojiPicking = useCallback(() => {
		setShowEmojis(prev => !prev);
	}, []);

	const handleClose = useCallback(() => {
		() => setShowEmojis(false);
	}, []);

	if (typeof data === 'undefined') {
		return <ActivityLoader />;
	}

	return (
		<SafeAreaView style={{flex: 1}}>
			<ImageBackground
				style={{flex: 1}}
				source={require('../../assets/images/bg.jpg')}>
				<Text
					style={{
						fontSize: 12,
						color: style.titleColor,
						textAlign: 'center',
					}}>
					All chat history will refresh after 7 days.
				</Text>
				<GiftedChat
					scrollToBottom
					infiniteScroll
					renderUsernameOnMessage
					renderBubble={renderBubble}
					renderAccessory={() => {
						return (
							<TouchableOpacity
								style={{marginLeft: 15}}
								onPress={handleEmojiPicking}>
								<MIcon
									name="emoji-emotions"
									color={style.primaryColor}
									size={22}
								/>
							</TouchableOpacity>
						);
					}}
					renderSend={props => {
						return (
							<Send
								{...props}
								containerStyle={{
									justifyContent: 'center',
									marginRight: 5,
								}}
								children={
									<FaIcon
										color={style.primaryColor}
										size={24}
										name={'send'}
									/>
								}
							/>
						);
					}}
					text={message}
					onInputTextChanged={val => setMessage(val)}
					onSend={handleSend}
					user={{
						_id: data?.id,
						name: `${data?.first_name} ${data?.last_name}`,
					}}
					messages={messages}
				/>
				<EmojiPicker
					open={showEmojis}
					onEmojiSelected={onEmojiSelected}
					onClose={handleClose}
				/>
			</ImageBackground>
		</SafeAreaView>
	);
}
