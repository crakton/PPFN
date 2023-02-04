import axios from "axios";
import {Toast} from "react-native-awesome";
import {appointment} from "../endpoints";

export default async function (id: string) {
	try {
		return await axios.get(
			appointment.concat(`/beneficiary_previous?beneficiary_id=${id}`),
		);
	} catch (error: any) {
		if (error === "Network Error") {
			Toast.showToast({
				message: "There is a problem with your network connection!",
			});
		}
		console.log("An error occured fectching client previous appointment");
		throw new Error(JSON.stringify(error));
	}
}
