import React from 'react';
import {LogBox} from 'react-native';
import RootNavigation from './src/navigations/root.navigation';

function App() {
	LogBox.ignoreLogs(['[storage/object-not-found]']);
	return <RootNavigation />;
}

export default App;
