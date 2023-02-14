import {configureStore} from "@reduxjs/toolkit";
import appointments from "./appointments";
import calls from "./calls/calls";
import isSigned from "./auth/isSigned";
import listPrviderReducer from "./provider/listProvider";
import notifications from "./notifications";
import reports from "./reports";
import userDataReducer from "./user/userData";
export const store = configureStore({
	reducer: {
		appointments,
		calls,
		isSigned,
		notifications,
		provider: listPrviderReducer,
		reports,
		userData: userDataReducer,
	},
});
