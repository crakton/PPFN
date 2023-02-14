import {fcm_server} from "@env";
import axios from "axios";

export default async function (
	to: string,
	body: string,
	title: string,
	data?: {},
) {
	try {
		await axios.post(
			"https://fcm.googleapis.com/fcm/send",
			{
				notification: {
					title,
					body,
				},
				data,
				to,
			},
			{
				headers: {
					Authorization: `key=${fcm_server}`,
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.log(error);
	}
}
