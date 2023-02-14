import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

import notifeeServices from "./notifee.service";
import {store} from "../redux/store";
import {
	setAppointmentNotification,
	setCallNotification,
	setReportNotification,
} from "../redux/notifications";
import whichSignedUser from "../utils/whichSignedUser";

export class FirebaseServices {
	async signupEmailPassword(email: string, password: string) {
		try {
			return await auth().createUserWithEmailAndPassword(email, password);
		} catch (error) {
			return error;
		}
	}
	async signinEmailPassword(email: string, password: string) {
		try {
			return await auth().signInWithEmailAndPassword(email, password);
		} catch (error) {
			return error;
		}
	}

	async getUserDoc(user: string) {
		try {
			return (
				await firestore().collection("Users").doc(user).get()
			).data();
		} catch (error) {
			console.log(error);
		}
	}

	async addUserDoc(user: string, payload: {}) {
		try {
			await firestore()
				.collection("Users")
				.doc(user)
				.set({
					...payload,
					created_at: firestore.FieldValue.serverTimestamp(),
				});
		} catch (error) {
			console.log(error);
		}
	}
	async updateUserDoc(user: string, payload: {}) {
		try {
			await firestore()
				.collection("Users")
				.doc(user)
				.update({
					...payload,
					update_at: firestore.FieldValue.serverTimestamp(),
				});
		} catch (error) {
			console.log(error);
		}
	}
	async deleteUserDoc(user: string) {
		try {
			await firestore().collection("Users").doc(user).delete();
		} catch (error) {
			console.log(error);
		}
	}
	async resetPassword(email: string) {
		try {
			await auth().sendPasswordResetEmail(email);
		} catch (error) {
			console.log(error);
		}
	}
	signOut() {
		auth()
			.signOut()
			.then(() => console.log("User signed out!"));
	}

	async requestFirebaseUserPermission() {
		try {
			const authStatus = await messaging().requestPermission();
			const enabled =
				authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
				authStatus === messaging.AuthorizationStatus.PROVISIONAL;

			if (enabled) {
				console.log("Authorization status:", authStatus);
			}
		} catch (error) {
			console.log(error);
		}
	}

	foregroundFCM() {
		try {
			messaging().onMessage(async remoteMessage => {
				if (remoteMessage.data?.type === "CALL") {
					// store.dispatch(
					// 	setCallNotification({
					// 		body: remoteMessage.notification?.body,
					// 		channel: remoteMessage.data.channel,
					// 		title: remoteMessage.notification?.title,
					// 		uid: remoteMessage.data.uid,
					// 		username: remoteMessage.data.username,
					// 	}),
					// );
					await notifeeServices.displayCallNofication(
						remoteMessage.notification?.title,
						remoteMessage.notification?.body,
						remoteMessage.data,
					);
				}
				if (remoteMessage.data?.type === "APPOINTMENT") {
					store.dispatch(
						setAppointmentNotification({
							body: remoteMessage.notification?.body,
							title: remoteMessage.notification?.title,
						}),
					);
					await notifeeServices.displayOtherNofication(
						`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
						`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
						remoteMessage.data,
					);
				}
				if (remoteMessage.data?.type === "REPORT") {
					store.dispatch(
						setReportNotification({
							body: remoteMessage.notification?.body,
							title: remoteMessage.notification?.title,
						}),
					);
					await notifeeServices.displayOtherNofication(
						`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
						`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
						remoteMessage.data,
					);
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
	async backgroundFCM() {
		try {
			// const {client_data, provider_data} = store.getState().userData;
			// const user = await whichSignedUser();
			// const userdata = "client" ? client_data : provider_data;
			messaging().setBackgroundMessageHandler(async remoteMessage => {
				if (remoteMessage.data?.type === "CALL") {
					store.dispatch(
						setCallNotification({
							body: remoteMessage.notification?.body,
							channel: remoteMessage.data.channel,
							title: remoteMessage.notification?.title,
							uid: remoteMessage.data.uid,
							username: remoteMessage.data.username,
						}),
					);
					await notifee.incrementBadgeCount();

					await notifeeServices.displayCallNofication(
						`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
						`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
						remoteMessage.data,
					);
				}
				if (remoteMessage.data?.type === "APPOINTMENT") {
					store.dispatch(
						setAppointmentNotification({
							body: remoteMessage.notification?.body,
							title: remoteMessage.notification?.title,
						}),
					);
					await notifee.incrementBadgeCount();
					await notifeeServices.displayOtherNofication(
						`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
						`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
						remoteMessage.data,
					);
				}
				if (remoteMessage.data?.type === "REPORT") {
					store.dispatch(
						setReportNotification({
							body: remoteMessage.notification?.body,
							title: remoteMessage.notification?.title,
						}),
					);
					await notifee.incrementBadgeCount();
					await notifeeServices.displayOtherNofication(
						`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
						`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
						remoteMessage.data,
					);
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
	onOpenNotification() {
		messaging().onNotificationOpenedApp(async remoteMessage => {
			try {
				if (remoteMessage.data?.type === "CALL") {
					store.dispatch(
						setCallNotification({
							body: remoteMessage.notification?.body,
							channel: remoteMessage.data.channel,
							title: remoteMessage.notification?.title,
							uid: remoteMessage.data.uid,
							username: remoteMessage.data.username,
						}),
					);
					await notifee.incrementBadgeCount();
					await notifeeServices.displayCallNofication(
						remoteMessage.notification?.title,
						remoteMessage.notification?.body,
						remoteMessage.data,
					);
				}
			} catch (error) {
				console.log(error);
			}
			try {
				if (remoteMessage.data?.type === "APPOINTMENT") {
					store.dispatch(
						setAppointmentNotification({
							body: remoteMessage.notification?.body,
							title: remoteMessage.notification?.title,
						}),
					);
					await notifee.incrementBadgeCount();
					await notifeeServices.displayOtherNofication(
						`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
						`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
						remoteMessage.data,
					);
				}
			} catch (error) {
				console.log(error);
			}
			try {
				if (remoteMessage.data?.type === "REPORT") {
					store.dispatch(
						setReportNotification({
							body: remoteMessage.notification?.body,
							title: remoteMessage.notification?.title,
						}),
					);
					await notifee.incrementBadgeCount();
					await notifeeServices.displayOtherNofication(
						`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
						`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
						remoteMessage.data,
					);
				}
			} catch (error) {
				console.log(error);
			}
		});
	}
	quitStateNotification() {
		messaging()
			.getInitialNotification()
			.then(async remoteMessage => {
				try {
					if (remoteMessage?.data?.type === "CALL") {
						store.dispatch(
							setCallNotification({
								body: remoteMessage.notification?.body,
								channel: remoteMessage.data.channel,
								title: remoteMessage.notification?.title,
								uid: remoteMessage.data.uid,
								username: remoteMessage.data.username,
							}),
						);
						await notifee.incrementBadgeCount();
						await notifeeServices.displayCallNofication(
							remoteMessage.notification?.title,
							remoteMessage.notification?.body,
							remoteMessage.data,
						);
					}
				} catch (error) {
					console.log(error);
				}
				try {
					if (remoteMessage?.data?.type === "APPOINTMENT") {
						store.dispatch(
							setAppointmentNotification({
								body: remoteMessage.notification?.body,
								title: remoteMessage.notification?.title,
							}),
						);
						await notifee.incrementBadgeCount();
						await notifeeServices.displayOtherNofication(
							`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
							`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
							remoteMessage.data,
						);
					}
				} catch (error) {
					console.log(error);
				}
				try {
					if (remoteMessage?.data?.type === "REPORT") {
						store.dispatch(
							setReportNotification({
								body: remoteMessage.notification?.body,
								title: remoteMessage.notification?.title,
							}),
						);
						await notifee.incrementBadgeCount();
						await notifeeServices.displayOtherNofication(
							`<p style="color: #39156a;">${remoteMessage.notification?.title}</p>`,
							`<p style="color: #5E96CF;">${remoteMessage.notification?.body}</p>`,
							remoteMessage.data,
						);
					}
				} catch (error) {
					console.log(error);
				}
			});
	}

	async getFCMToken() {
		try {
			await messaging().registerDeviceForRemoteMessages();
			return await messaging().getToken();
		} catch (error) {
			console.log(error);
		}
	}
	newFCMToken() {
		try {
			messaging().onTokenRefresh(async token => {
				let user = await whichSignedUser();
				let {client_data, provider_data} = store.getState().userData;

				//update token to firestore
				this.updateUserDoc(
					user === "client"
						? `@${client_data.last_name}`
						: `@${provider_data.last_name}`,
					{fcm_token: token},
				);
			});
		} catch (error) {
			console.log(error);
		}
	}
	userRef(uid: string) {
		return database().ref("Users/".concat(uid));
	}
}
const firebaseServices = new FirebaseServices();
export default firebaseServices;
