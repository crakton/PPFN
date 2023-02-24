import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {FlatList} from "react-native";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {Toast} from "react-native-awesome";
import {DateData} from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useDispatch, useSelector} from "react-redux";
import {CustomCalendar} from "../../components/CustomCalendar";
import {RippleButton} from "../../components/widgets/RippleButton";

import {style} from "../../constants/style";
import {INavigateProps} from "../../interfaces";
import Layout from "../../layouts/DrawerScreenLayout";
import {getProviderData} from "../../redux/user/userData";
import {RootState} from "../../types/redux.type";
import {WIDTH} from "../../utils/dim";

const Timeslot = memo(() => {
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const [slots, setSlots] = useState([]);
	const dispatch = useDispatch();
	const {navigate} = useNavigation<{navigate: INavigateProps}>();

	const [bookDates, setBookDates] = useState(new Set(""));

	useEffect(() => {
		if (provider_data.doctorSlot === undefined) {
			setSlots([]);
		} else {
			setSlots(JSON.parse(provider_data.doctorSlot));
		}
		// setSlots(JSON.parse(provider_data.doctorSlot));
	}, [provider_data]);

	const handleSubmit = useCallback(async () => {
		const dates = Array.from(bookDates); //convert Set to Array
		if (!dates.length) {
			Toast.showToast({
				message: "Please set avail dates.",
				type: "warning",
				duration: 2000,
			});
			return;
		}

		try {
			const Slots: string[] = slots; //get a copy of the slots Array
			Slots.push(...dates); // merge the two arrays
			const uniqSlots = new Set(Slots);
			const response = await axios.put(
				`https://ppfnhealthapp.com/api/provider/${provider_data.id}`,
				{
					doctorSlot: JSON.stringify(Array.from(uniqSlots)), //send in the form of unique array elements
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status) {
				if (response.data.provider.doctorSlot) {
					const data = Object.assign({}, response.data.provider);
					delete data.hash; //remove password from being store on the device
					setSlots(JSON.parse(response.data.provider.doctorSlot));
					await AsyncStorage.setItem(
						"provider_data",
						JSON.stringify(response.data.provider),
					);

					dispatch(getProviderData(data));
					navigate("timeslot");
				}

				Toast.showToast({
					message: "Time slot successfully set.",
					type: "success",
					duration: 2000,
				});
			}
		} catch (error) {
			console.log(error);
		}
	}, [bookDates, dispatch, slots]);

	const handleSelectedDates = useCallback(
		(date: DateData) => {
			const {dateString, day, month, year} = date;
			if (
				year >= new Date().getFullYear() &&
				month >= new Date().getMonth() + 1 &&
				day >= new Date().getDate()
			) {
				const newBookDates = new Set(bookDates);

				if (newBookDates.has(dateString)) {
					newBookDates.delete(dateString);
				} else {
					newBookDates.add(dateString);
				}
				setBookDates(newBookDates);
			} else if (month > new Date().getMonth() + 1) {
				const newBookDates = new Set(bookDates);

				if (newBookDates.has(dateString)) {
					newBookDates.delete(dateString);
				} else {
					newBookDates.add(dateString);
				}
				setBookDates(newBookDates);
			} else {
				Toast.showToast({
					message: "You can't set appointment in the past!",
					type: "warning",
					duration: 1000,
				});
			}
		},
		[bookDates],
	);

	const handleDeleteSlot = useCallback(
		async (id: number) => {
			const updatedSlots = slots.filter((_, idx) => idx !== id);
			console.log("updates on slots", updatedSlots);

			try {
				const response = await axios.put(
					`https://ppfnhealthapp.com/api/provider/${provider_data.id}`,
					{
						doctorSlot: JSON.stringify(updatedSlots),
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
				if (response.status) {
					if (response.data.provider.doctorSlot) {
						const data = Object.assign({}, response.data.provider);
						delete data.hash; //remove password from being store on the device
						setSlots(JSON.parse(response.data.provider.doctorSlot));
						await AsyncStorage.setItem(
							"provider_data",
							JSON.stringify(response.data.provider),
						);

						dispatch(getProviderData(data));
					}

					Toast.showToast({
						message: "Slot successfully removed.",
						type: "success",
						duration: 2000,
					});
					navigate("timeslot");
				}
			} catch (error) {
				console.log(error);
			}
		},
		[dispatch, slots],
	);

	const markedDates = useMemo(
		() =>
			[...bookDates].reduce((obj, item) => {
				obj[item] = {
					selected: true,
					marked: true,
					selectedColor: "#FE593D",
				};
				return obj;
			}, {}),
		[bookDates],
	);

	return (
		<SafeAreaView style={{flex: 1}}>
			<Layout
				title={`${provider_data.title}. ${provider_data.first_name} ${provider_data.last_name}`}
				rating={provider_data.rating}>
				{/* <WeekCalendar  /> */}

				<CustomCalendar
					myCustomCalendar
					handleDateChange={handleSelectedDates}
					markers={markedDates}
				/>

				<View style={styles.setslotContainer}>
					<TouchableOpacity
						onPress={handleSubmit}
						style={styles.setslot}>
						<Text style={styles.setSlotText}>Set Slots</Text>
					</TouchableOpacity>
				</View>
				{slots.length ? (
					<Text style={{textAlign: "center", padding: 10}}>
						Avaliable slots
					</Text>
				) : null}
				{slots.length ? (
					<FlatList
						contentContainerStyle={styles.setslotContainer}
						scrollEnabled
						data={slots}
						renderItem={({item, index}) =>
							Slot(item, () => handleDeleteSlot(index))
						}
					/>
				) : null}
			</Layout>
		</SafeAreaView>
	);
});

export default Timeslot;
const styles = StyleSheet.create({
	constainer: {padding: 15},
	pagerView: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		borderRadius: 10,
		backgroundColor: style.primaryColor,
	},
	headerTitle: {
		color: style.highlight,
		fontFamily: "AltonaSans-Regular",
		fontWeight: "500",
		fontSize: 20,
	},
	setslotContainer: {alignItems: "center", marginBottom: 40},
	setslot: {
		width: WIDTH / 1.5,
		backgroundColor: style.primaryColor,
		padding: 10,
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	setSlotText: {
		fontFamily: "AltonaSans-Regular",
		fontWeight: "500",
		fontSize: 18,
		color: style.cardColor,
	},
	delsection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: style.highlight,
		padding: 5,
		borderRadius: 10,
		shadowOffset: {width: 100, height: 50},
		shadowColor: style.tertiaryColor,
		shadowRadius: 100,
		shadowOpacity: 0.2,
		elevation: 5,
		marginTop: 10,
	},
	weekdayContainer: {
		borderRadius: 10,
		padding: 5,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
function Slot(slot: never, onDelete: (id: number) => void): JSX.Element {
	return (
		<View style={styles.delsection}>
			<Text
				style={[
					styles.setSlotText,
					{color: style.primaryColor, padding: 5},
				]}>
				{slot}
			</Text>
			<TouchableOpacity onPress={onDelete} style={{padding: 10}}>
				<Icon name="delete" color={"red"} size={22} />
			</TouchableOpacity>
		</View>
	);
}
