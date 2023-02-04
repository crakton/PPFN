import axios from "axios";
import {headers} from "../../constants/headers";
import {authenticate_client} from "../endpoints";

export default async function (data: string) {
	try {
		return await axios({
			method: "POST",
			url: authenticate_client,
			data,
			headers,
		});
	} catch (error: any) {
		throw new Error(JSON.stringify(error));
	}
}
