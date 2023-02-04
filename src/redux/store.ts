import { configureStore } from '@reduxjs/toolkit';
import isSigned from './auth/isSigned';
import userDataReducer from './user/userData';
import listPrviderReducer from './provider/listProvider';
import appointments from './appointments';
import reports from './reports';
import calls from './calls/calls';
export const store = configureStore({
	reducer: {
		appointments,
		calls,
		isSigned,
		provider: listPrviderReducer,
		reports,
		userData: userDataReducer,
	},
});
