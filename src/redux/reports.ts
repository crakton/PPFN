import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IReports from '../interfaces/reports';

type StateSlice = IReports[];

const initialState: StateSlice = [
	//   {
	// 	id: 0,
	// 	status: '',
	// 	appointment_id: 0,
	// 	beneficiary_id: 0,
	// 	created_at: '',
	// 	file_path: '',
	// 	provider_id: 0,
	// 	title: ''
	// }
];

const reports = createSlice({
	name: 'reports',
	initialState,
	reducers: {
		updateReport(state, action: PayloadAction<IReports[]>) {
			return (state = action.payload);
		},
	},
});

export const {
	updateReport
} = reports.actions;

export default reports.reducer;
