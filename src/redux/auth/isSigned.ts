import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SliceState = {
	is_signed: string | null | undefined;
	email: string;
};
const initialState: SliceState = {
	is_signed: undefined,
	email: '',
};
const userReducer = createSlice({
	initialState,
	name: 'user-data',
	reducers: {
		isSigned(state, action: PayloadAction<string | null | undefined>) {
			state.is_signed = action.payload;
		},
		setEmail(state, action: PayloadAction<string>) {
			state.email = action.payload
		}
	},
});

export const { setEmail, isSigned } = userReducer.actions;

export default userReducer.reducer;
