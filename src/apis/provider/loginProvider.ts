import axios from 'axios';
import {headers} from '../../constants/headers';
import {authenticate_provider} from '../endpoints';

export default async function loginProvider(data: string) {
	try {
		return await axios.post(authenticate_provider, data, {headers});
	} catch (error: any) {
		throw new Error(JSON.stringify(error));
	}
}
