import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StateSlice = {
	notificatons: {
		appointments: {
			read:
				| {
						body: string | undefined;
						title: string | undefined;
				  }[]
				| undefined;
			unread:
				| {
						body: string | undefined;
						title: string | undefined;
				  }[]
				| undefined;
		};
		calls: {
			read:
				| {
						body: string | undefined;
						channel: string | undefined;
						title: string | undefined;
						uid: string | undefined;
						username: string | undefined;
				  }[]
				| undefined;
			unread:
				| {
						body: string | undefined;
						channel: string | undefined;
						title: string | undefined;
						uid: string | undefined;
						username: string | undefined;
				  }[]
				| undefined;
		};
		reports: {
			read:
				| {body: string | undefined; title: string | undefined}[]
				| undefined;
			unread:
				| {body: string | undefined; title: string | undefined}[]
				| undefined;
		};
	};
};

const initialState: StateSlice = {
	notificatons: {
		appointments: {
			read: [],
			unread: [],
		},
		calls: {
			read: [],
			unread: [],
		},
		reports: {
			read: [],
			unread: [],
		},
	},
};

const notifications = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		setAppointmentNotification(
			state,
			action: PayloadAction<{
				body: string | undefined;
				title: string | undefined;
			}>,
		) {
			state.notificatons.appointments.unread?.push(action.payload);
		},
		setCallNotification(
			state,
			action: PayloadAction<{
				body: string | undefined;
				channel: string | undefined;
				title: string | undefined;
				uid: string | undefined;
				username: string | undefined;
			}>,
		) {
			state.notificatons.calls.unread?.push(action.payload);
		},
		setReportNotification(
			state,
			action: PayloadAction<{
				body: string | undefined;
				title: string | undefined;
			}>,
		) {
			state.notificatons.reports.unread?.push(action.payload);
		},
		deleteCallNotification(state, action: PayloadAction<number>) {
			if (state.notificatons.calls.read?.length) {
				state.notificatons.calls.read?.splice(action.payload, +1);
			}
		},
		deleteAppointmentNotification(state, action: PayloadAction<number>) {
			if (state.notificatons.appointments.read?.length) {
				state.notificatons.appointments.read?.splice(
					action.payload,
					+1,
				);
			}
		},
		deleteReportNotification(state, action: PayloadAction<number>) {
			if (state.notificatons.reports.read?.length) {
				state.notificatons.reports.read?.splice(action.payload, +1);
			}
		},
		updateAppointmentNotification(state, action: PayloadAction<number>) {
			if (state.notificatons.appointments.unread?.length) {
				const read = state.notificatons.appointments.unread?.splice(
					action.payload,
					+1,
				);
				console.log("read ", read);
				state.notificatons.appointments.read?.push(...read);
			}
		},
		updateCallNotification(state, action: PayloadAction<number>) {
			if (state.notificatons.calls.unread?.length) {
				const read = state.notificatons.calls.unread?.splice(
					action.payload,
					+1,
				);

				state.notificatons.calls.read?.push(...read);
			}
		},
		updateReportNotification(state, action: PayloadAction<number>) {
			if (state.notificatons.reports.unread) {
				const read = state.notificatons.reports.unread?.splice(
					action.payload,
					+1,
				);

				state.notificatons.reports.read?.push(...read);
			}
		},
	},
});

export const {
	deleteAppointmentNotification,
	deleteCallNotification,
	deleteReportNotification,
	setAppointmentNotification,
	setCallNotification,
	setReportNotification,
	updateAppointmentNotification,
	updateCallNotification,
	updateReportNotification,
} = notifications.actions;

export default notifications.reducer;
