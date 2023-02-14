import { agora_tokenuri } from "@env";
import axios from "axios";
export default async function (ch: string, uid: string) {
	try {
		const token = await axios.get(
			agora_tokenuri.concat(`/rtc/${ch}/${ch}/uid/${uid}/?expiry=3600`),
		);
		return token.data.rtcToken;
	} catch (error) {
		console.log(error);
	}
}
