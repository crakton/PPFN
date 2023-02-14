import {agora_appid, agora_tokenuri} from "@env";
import {useNavigation} from "@react-navigation/native";
import AgoraUIKit, {DualStreamMode} from "agora-rn-uikit";
import React, {memo} from "react";

import CallLayout from "../layouts/call.layout";

const Call = memo(({route}: {route: any}) => {
	const navigation = useNavigation();
	return (
		<CallLayout>
			<AgoraUIKit
				connectionData={{
					appId: agora_appid,
					tokenUrl: agora_tokenuri,
					channel: route.params.channel,
					rtcUid: parseInt(route.params.uid),
					username: route.params.username,
				}}
				settings={{
					displayUsername: true,
					dual: true,
					initialDualStreamMode: DualStreamMode.HIGH,
				}}
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
