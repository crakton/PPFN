import axios from 'axios';
import {appointment} from '../endpoints';

export default async function (id: string) {
	try {
		return await axios.get(
			appointment.concat(`/provider_upcoming?prov_id=${id}`)
		);
	} catch (error: any) {
		console.log('An error occured fectching upcoming provider appointment');
		throw new Error(error);
	}
}
