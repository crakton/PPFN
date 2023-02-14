import axios from "axios";

export async function verifyProvider(email: string) {
	try {
		return await axios.post(
			"https://ppfnhealthapp.com/api/authenticate/verify_email",
			{
				email,
				type: "provider",
			},
		);
	} catch (error) {
		console.log("verification error: ", error);
	}
}

export async function verifyClient(email: string) {
	try {
		return await axios.post(
			"https://ppfnhealthapp.com/api/authenticate/verify_email",
			{
				email,
				type: "beneficiary",
			},
		);
	} catch (error) {
		console.log("verification error: ", error);
	}
}
