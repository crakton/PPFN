import AsyncStorage from "@react-native-async-storage/async-storage";
import requestCameraAndAudioPermission from "agora-rn-uikit/src/Utils/permission";
import notifee from "@notifee/react-native";
import axios from "axios";
import RNBootSplash from "react-native-bootsplash";
import {provider} from "../apis/endpoints";
import {returnListOfProviders} from "../redux/provider/listProvider";
import {store} from "../redux/store";
import firebaseServices from "./firebase.service";
import notifeeServices from "./notifee.service";
import {verifyClient, verifyProvider} from "../apis/email-verification";
import {Toast} from "react-native-awesome";
import updateClient from "../apis/client/updateClient";

class AppService {
	async init() {
		/* some app paintings */
		try {
			RNBootSplash.hide().finally(async () => {
				/* do actions immediately when the splash is hidden */
				await requestCameraAndAudioPermission();
				firebaseServices.quitStateNotification();
				firebaseServices.onOpenNotification();
				await firebaseServices.requestFirebaseUserPermission();
				firebaseServices.newFCMToken();
				await notifee.requestPermission();
				await notifee.setBadgeCount(0);
				notifeeServices.registerForegroundNotification();
				console.log(
					"old fcm_token ",
					await firebaseServices.getFCMToken(),
				);
			});
			// const response = await listProvider();
			const response = await axios.get(provider);

			await AsyncStorage.setItem(
				"list_provider",
				JSON.stringify(response.data),
			);

			store.dispatch(returnListOfProviders(response.data));
		} catch (error) {
			console.log(error);
		}
	}
	async resetPassword(email: string) {
		try {
			const clientResponse = await verifyClient(email);
			const providerResponse = await verifyProvider(email);
			if (clientResponse?.status === 200) {
				return await clientResponse.data;
			} else if (providerResponse?.status === 200) {
				return await providerResponse.data;
			}
			return;
		} catch (error) {
			Toast.showToast({
				message: "Email does not exist!",
				type: "danger",
				duration: 3000,
			});
			console.log(error);
		}
	}
}
const appService = new AppService();
export default appService;
