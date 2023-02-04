import axios from "axios";
import {provider} from "../endpoints";

export default async function () {
	try {
		return await axios.get(provider);
	} catch (error: any) {
		if (error === "Network Error") {
			Toast("There is a problem with your network connection!");
		}
		throw new Error("Error log: " + error);
	}
}
