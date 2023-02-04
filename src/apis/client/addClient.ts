import axios from "axios";
// import {headers} from '../../constants/headers';
import {client} from "../endpoints";

export default async function (formData: string) {
	try {
		return await axios({
			url: client,
			data: formData,
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
				Accept: "application/json",
			},
		});
	} catch (error: any) {
		if (error === "Network Error") {
			Toast("There is a problem with your network connection!");
		} else if (error.response) {
			// Request made but the server responded with an error
			Toast("Something went wrong!");
			throw new Error("Error log: " + error);
		} else if (error.request) {
			// Request made but no response is received from the server.
			Toast("Sorry, the problem is from us.");
			throw new Error("Error log: " + error);
		} else {
			// Error occured while setting up the request
			Toast("An error occured!");
			throw new Error("Error log: " + error);
		}
	}
}
