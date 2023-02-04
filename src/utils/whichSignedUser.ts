import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function whichSignedUser(): Promise<string> {
	try {
		const is_provider = await AsyncStorage.getItem('is_provider');
		const is_client = await AsyncStorage.getItem('is_client');

		if (is_provider === 'yes') {
			return 'provider';
		}
		if (is_client === 'yes') {
			return 'client';
		}
		return '';
	} catch (error: any) {
		throw new Error(error);
	}
}
