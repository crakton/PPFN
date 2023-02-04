import {NavigationContainer} from "@react-navigation/native";
import React, {memo} from "react";
import {ErrorBoundary, ToastController} from "react-native-awesome";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import appService from "../services/app.service";
import StackNav from "./stack.navigation";

const RootNavigation = memo(() => {
	return (
		<ErrorBoundary>
			<GestureHandlerRootView style={{flex: 1}}>
				<NavigationContainer
					onReady={async () => await appService.init()}>
					<StackNav />
				</NavigationContainer>
				<ToastController />
			</GestureHandlerRootView>
		</ErrorBoundary>
	);
});

export default RootNavigation;
