import {agora_appid} from "@env";
import {useNavigation} from "@react-navigation/native";
import AgoraUIKit from "agora-rn-uikit";
import React, {memo} from "react";

import CallLayout from "../layouts/call.layout";

const generateID = () => Math.floor(Math.random() * 1000);

const Call = memo(({route}: {route: any}) => {
	const navigation = useNavigation();
	return (
		<CallLayout>
			<AgoraUIKit
				connectionData={{
					appId: agora_appid,
					rtcToken: route.params.token,
					channel: route.params.channel,
					rtcUid: parseInt(route.params.uid),
					username: route.params.username,
				}}
				settings={{displayUsername: true}}
				rtcCallbacks={{
					EndCall() {
						navigation.goBack();
					},
				}}
			/>
		</CallLayout>
	);
});

export default Call;
