import axios from "axios";
import {Toast} from "react-native-awesome";
import {provider} from "./../endpoints";

export default async function (id: number, data: string) {
	try {
		return await axios({
			method: "POST",
			data,
			url: provider.concat(`/${id}`),
		});
	} catch (error: any) {
		if (error === "Network Error") {
			Toast.showToast({
				message:
					"There is a problem with the internet connection. Try again!",
			});
			console.log(error);
		}
		console.log(error);
	}
}
