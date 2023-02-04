import AsyncStorage from "@react-native-async-storage/async-storage";
import requestCameraAndAudioPermission from "agora-rn-uikit/src/Utils/permission";

import axios from "axios";
import RNBootSplash from "react-native-bootsplash";
import {provider} from "../apis/endpoints";
import {returnListOfProviders} from "../redux/provider/listProvider";
import {store} from "../redux/store";

class AppService {
	async init() {
		/* some app paintings */
		try {
			RNBootSplash.hide().finally(async () => {
				/* do actions immediately when the splash is hidden */
				await requestCameraAndAudioPermission();
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
}
const appService = new AppService();
export default appService;
