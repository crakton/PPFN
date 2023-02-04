import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Voximplant } from "react-native-voximplant";

type TCalls = {
	endpoint: Voximplant.Endpoint | undefined;
	localVideoStreamId: string | undefined;
	remoteVideoStreamId: string | undefined;
	callState: string | undefined;
	call: Voximplant.Call | undefined
	callId: string | undefined,
	incomingCall: Voximplant.ClientEvents.IncomingCall | undefined;
	incomingCallId: string | undefined;
}

const initialState: TCalls = {
	call: undefined,
	callId: '',
	callState: 'Connecting',
	endpoint: '',
	incomingCall: undefined,
	incomingCallId: '',
	localVideoStreamId: '',
	remoteVideoStreamId: ''
}

const calls = createSlice({
	name: 'inapp_call',
	initialState,
	reducers: {
		setCall(state, action: PayloadAction<Voximplant.Call>) {
			state.call = action.payload
		},
		setCallState(state, action: PayloadAction<string>) {
			state.callState = action.payload
		},
		setCallId(state, action: PayloadAction<string>) {
			state.callId = action.payload
		},
		setEndpoint(state, action: PayloadAction<Voximplant.Endpoint>) {
			state.endpoint = action.payload
		},
		setIncomingCall(state, action: PayloadAction<Voximplant.ClientEvents.IncomingCall>) {
			state.incomingCall = action.payload
		},
		setIncomingCallId(state, action: PayloadAction<string>) {
			state.incomingCallId = action.payload
		}

	}
})

export const { setIncomingCall, setCall, setCallId, setEndpoint, setCallState, setIncomingCallId } = calls.actions
export default calls.reducer
