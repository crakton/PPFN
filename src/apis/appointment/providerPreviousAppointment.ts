import axios from "axios";
import {appointment} from "../endpoints";

export default async function (id: string) {
	try {
		return await axios.get(
			appointment.concat(`/provider_previous?prov_id=${id}`),
		);
	} catch (error: any) {
		if (error === "Network Error") {
			Toast("There is a problem with your network connection!");
		}
		console.log("An error occured fectching appointment");
		throw new Error("Error log: " + error);
	}
}
