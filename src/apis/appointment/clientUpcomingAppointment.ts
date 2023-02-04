import axios from "axios";
import {appointment} from "../endpoints";

export default async function (id: string) {
	try {
		return await axios.get(
			appointment.concat(`/beneficiary_upcoming?beneficiary_id=${id}`),
		);
	} catch (error: any) {
		if (error === "Network Error") {
			Toast("There is a problem with your network connection!");
		}
		console.log("An error occured fectching client upcoming appointment");
		throw new Error(JSON.stringify(error));
	}
}
