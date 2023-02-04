import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IListProvider from '../../interfaces/listProvider';

type SliceState = IListProvider[];

const initialState: SliceState = [
	{
		state: '',
		address: '',
		category: '',
		city: '',
		date_of_birth: '',
		email: '',
		experience: '',
		facility: '',
		first_name: '',
		gender: '',
		id: undefined,
		last_name: '',
		next_of_kin: '',
		phone_number: '',
		relationship_with_nok: '',
		title: '',
		image: '',
		popularity: '',
		photo_name: '',
		rating: 0,
	},
];

const listProviderReducer = createSlice({
	name: 'list_provider',
	initialState,
	reducers: {
		returnListOfProviders(_state, action: PayloadAction<IListProvider[]>) {
			return action.payload;
		},
	},
});
export const { returnListOfProviders } = listProviderReducer.actions;
export default listProviderReducer.reducer;
