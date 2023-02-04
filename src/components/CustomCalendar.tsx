import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Calendar} from "react-native-calendars";
import FoIcon from "react-native-vector-icons/Fontisto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Text, TouchableOpacity} from "react-native";
import {formatMonth} from "../utils/formatMonth";
import {style} from "../constants/style";
import {Toast} from "react-native-awesome";

export const CustomCalendar = React.memo(function () {
	const [bookDates, setBookDates] = useState(new Set(""));
	const handleSelectedDates = useCallback(
		({
			dateString,
			day,
			month,
		}: {
			dateStrng: string;
			day: string;
			month: string;
		}) => {
			if (
				day >= new Date().getDate() &&
				month >= new Date().getMonth() + 1
			) {
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
					type: "waring",
					duration: 2000,
				});
			}
		},
		[bookDates],
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
		<Calendar
			onDayPress={handleSelectedDates}
			headerStyle={{
				backgroundColor: style.primaryColor,
			}}
			markedDates={markedDates}
			renderHeader={date => (
				<Text
					style={{
						fontSize: 18,
						fontWeight: "500",
						color: style.titleColor,
					}}>
					{formatMonth(date)}
				</Text>
			)}
			renderArrow={direction => (
				<>
					{direction === "left" && (
						<FoIcon
							color={style.titleColor}
							size={18}
							name="angle-left"
						/>
					)}
					{direction === "right" && (
						<FoIcon
							color={style.titleColor}
							size={18}
							name="angle-right"
						/>
					)}
				</>
			)}
		/>
	);
});
