import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import IListAppointment from '../interfaces/listAppointment';

type StateSlice = {
	upcoming_client_appointment: IListAppointment[];
	previous_client_appointment: IListAppointment[];
	upcoming_provider_appointment: IListAppointment[];
	previous_provider_appointment: IListAppointment[];
};

const initialState: StateSlice = {
	previous_client_appointment: [],
	previous_provider_appointment: [],
	upcoming_client_appointment: [],
	upcoming_provider_appointment: [],
};

const appointments = createSlice({
	name: 'appointments',
	initialState,
	reducers: {
		getUpcomingClientAppointment(state, action: PayloadAction<any>) {
			state.upcoming_client_appointment = action.payload;
		},
		getUpcomingProviderAppointment(state, action: PayloadAction<any>) {
			state.upcoming_provider_appointment = action.payload;
		},
		getPreviousClientAppointment(state, action: PayloadAction<any>) {
			state.previous_client_appointment = action.payload;
		},
		getPreviousProviderAppointment(state, action: PayloadAction<any>) {
			state.previous_provider_appointment = action.payload;
		},
	},
});

export const {
	getPreviousClientAppointment,
	getPreviousProviderAppointment,
	getUpcomingClientAppointment,
	getUpcomingProviderAppointment,
} = appointments.actions;

export default appointments.reducer;
