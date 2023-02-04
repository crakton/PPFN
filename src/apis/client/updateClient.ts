import axios from "axios";
import {Toast} from "react-native-awesome";
import {client} from "../endpoints";

export default async function (id: number, data: string) {
	try {
		return await axios({
			method: "POST",
			data,
			url: client.concat(`/${id}`),
		});
	} catch (error: any) {
		if (error === "Network Error") {
			Toast.showToast({
				message:
					"There is a problem with the internet connection. Try again!",
			});
			console.log(JSON.stringify(error));
		}
		console.log(JSON.stringify(error));
	}
}
