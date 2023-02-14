/**
 * @format
 */
import React from "react";
import {AppRegistry} from "react-native";
import {Provider} from "react-redux";
import App from "./App";
import {name as appName} from "./app.json";
import {store} from "./src/redux/store";
import firebaseServices from "./src/services/firebase.service";

// Register background handler
firebaseServices.backgroundFCM();

const HeadlessCheck = ({isHeadless}) => {
	if (isHeadless) {
		return null;
	}
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
