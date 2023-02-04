import {PermissionsAndroid, Platform} from "react-native";

class Permissions {
	async requestAudioCallPermission() {
		if (Platform.OS === "android") {
			await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
			]);
		}
		return;
	}
	async requestVideoCallPermission() {
		if (Platform.OS === "android") {
			await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.CAMERA,
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
			]);
		}
		return;
	}
}
const permissions = new Permissions();
export default permissions;
