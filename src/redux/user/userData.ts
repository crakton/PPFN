import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import IClientData from "../../interfaces/clientData";
import IProviderData from "../../interfaces/providerData";

type SliceState = {
	client_data: IClientData;
	provider_data: IProviderData;
};
const initialState: SliceState = {
	client_data: {
		address: "",
		blood_group: "",
		city: "",
		date_of_birth: "",
		education: "",
		email: "",
		first_name: "",
		gender: "",
		genotype: "",
		geolocation: "",
		hash: "",
		height: "",
		id: "",
		image: "",
		insurar_name: "",
		last_login: "",
		last_name: "",
		marital_status: "",
		nationalID: "",
		next_of_kin: "",
		phone_number: "",
		photo: "",
		photo_error: "",
		photo_name: "",
		photo_size: "",
		photo_type: "",
		photo_path: "",
		regdate: "",
		relationship_with_nok: "",
		religion: "",
		state: "",
		status: "",
		system_user: "",
		weight: "",
	},
	provider_data: {
		state: "",
		doctorSlot: [],
		geo_location: "",
		image: "",
		last_login: "",
		nationalID: "",
		photo: "",
		photo_error: "",
		photo_name: "",
		photo_size: "",
		photo_type: "",
		photo_path: "",
		t1: 0,
		t2: 0,
		t3: 0,
		t4: 0,
		t5: 0,
		t6: 0,
		t7: 0,
		t8: 0,
		t9: 0,
		t10: 0,
		t11: 0,
		t12: 0,
		t13: 0,
		t14: 0,
		t15: 0,
		t16: 0,
		t17: 0,
		t18: 0,
		t19: 0,
		t20: 0,
		t21: 0,
		t22: 0,
		t23: 0,
		relationship_with_nok: "",
		phone_number: "",
		next_of_kin: "",
		last_name: "",
		id: "",
		gender: "",
		first_name: "",
		email: "",
		date_of_birth: "",
		city: "",
		address: "",
		category: "",
		experience: "",
		facility: "",
		title: "",
	},
};
const userDataReducer = createSlice({
	name: "user_data",
	initialState,
	reducers: {
		getClientData(state, action: PayloadAction<IClientData>) {
			state.client_data = action.payload;
		},
		getProviderData(state, action: PayloadAction<IProviderData>) {
			state.provider_data = action.payload;
		},
	},
});

export const {getClientData, getProviderData} = userDataReducer.actions;
export default userDataReducer.reducer;
