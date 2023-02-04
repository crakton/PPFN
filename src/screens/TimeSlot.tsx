import React, {memo, useCallback, useRef, useState} from "react";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {Toast} from "react-native-awesome";
import PagerView from "react-native-pager-view";
import SIcon from "react-native-vector-icons/SimpleLineIcons";
import {useSelector} from "react-redux";
import ScheduleSelector from "../components/ScheduleSelector";

import {style} from "../constants/style";
import Layout from "../layouts/DrawerScreenLayout";
import {RootState} from "../types/redux.type";
import {WIDTH} from "../utils/dim";
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const TimeSlot = memo(() => {
	const pagerRef = useRef<PagerView>(null);
	const [wkDay, setWkDay] = useState<number>();
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const handleMeridianChange = useCallback(
		(day: number) => {
			setWkDay(day);
		},
		[wkDay],
	);

	return (
		<SafeAreaView style={{flex: 1}}>
			<Layout
				title={`${provider_data.title}. ${provider_data.first_name} ${provider_data.last_name}`}
				rating={provider_data.rating}>
				<PagerView
					pageMargin={10}
					ref={pagerRef}
					style={styles.pagerView}
					initialPage={0}>
					<Meridian
						tfs={[
							"08:00 - 08-30",
							"09:00 - 09-30",
							"10:00 - 10-30",
							"11:00 - 11-30",
						]}
						key={1}
						meridian={"Morning"}
						handleWDChange={handleMeridianChange}
						wkDay={wkDay}
						handleNext={() => pagerRef.current?.setPage(1)}
					/>
					<Meridian
						tfs={[
							"12:00 - 12-30",
							"13:00 - 13-30",
							"14:00 - 14-30",
							"15:00 - 15-30",
						]}
						key={2}
						meridian={"Afternoon"}
						handleWDChange={handleMeridianChange}
						wkDay={wkDay}
						handleNext={() => pagerRef.current?.setPage(2)}
						handlePrev={() => pagerRef.current?.setPage(0)}
					/>
					<Meridian
						tfs={[
							"16:00 - 16-30",
							"17:00 - 17-30",
							"18:00 - 18-30",
							"19:00 - 19-30",
						]}
						key={3}
						meridian={"Evening"}
						handleWDChange={handleMeridianChange}
						wkDay={wkDay}
						handlePrev={() => pagerRef.current?.setPage(1)}
					/>
				</PagerView>
			</Layout>
		</SafeAreaView>
	);
});

const Meridian = memo(
	({
		meridian,
		handlePrev,
		handleNext,
		wkDay,
		tfs,
		handleWDChange,
	}: {
		meridian: string;
		handlePrev?: () => void;
		handleNext?: () => void;
		wkDay: number | undefined;
		tfs: string[];
		handleWDChange: (s: number) => void;
	}) => {
		const [timeFrame, setTimeFrame] = useState<string>(tfs[0]);
		const handleSubmit = useCallback(async () => {
			Toast.showToast({
				message: "Time slot successfully set.",
				type: "success",
				duration: 1000,
			});
		}, []);

		return (
			<ScrollView style={styles.constainer}>
				<View style={styles.header}>
					<TouchableOpacity onPress={handlePrev}>
						<SIcon
							size={20}
							color={style.highlight}
							name="arrow-left"
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{meridian}</Text>
					<TouchableOpacity onPress={handleNext}>
						<SIcon
							size={20}
							color={style.highlight}
							name="arrow-right"
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.weekdays}>
					{weekdays.map((day: string, idx: number) => {
						return (
							<TouchableOpacity
								key={idx}
								style={[
									styles.weekdayContainer,
									{
										backgroundColor:
											wkDay === idx
												? "#f00"
												: "transparent",
									},
								]}
								onPress={() => handleWDChange(idx)}>
								<Text
									style={{
										fontFamily: "AltonaSans-Regular",
										color:
											wkDay === idx
												? style.highlight
												: style.tertiaryColor,
									}}>
									{day}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>
				<ScheduleSelector
					setSelectedTimeFrame={setTimeFrame}
					selectedTimeFrame={timeFrame}
					timeFrameList={tfs}
				/>
				<View style={styles.setslotContainer}>
					<TouchableOpacity
						onPress={handleSubmit}
						style={styles.setslot}>
						<Text style={styles.setSlotText}>Set Slots</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	},
);

export default TimeSlot;
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
	weekdays: {
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
