import axios from "axios";
import {Toast} from "react-native-awesome";
import {provider} from "./../endpoints";

export default async function (id: number, data: any) {
	try {
		return await axios({
			method: "PUT",
			data,
			url: provider.concat(`/${id}`),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error: any) {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			console.log(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			Toast.showToast({
				message: "Something went wrong!",
				type: "warning",
			});
			console.log("Error", error.message);
		}
		console.log(error.config);
	}
}
