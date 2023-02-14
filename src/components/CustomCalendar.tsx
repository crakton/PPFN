import React from "react";
import {Calendar, DateData} from "react-native-calendars";
import FoIcon from "react-native-vector-icons/Fontisto";
import {Text} from "react-native";
import {formatMonth} from "../utils/formatMonth";
import {style} from "../constants/style";

export const CustomCalendar = React.memo(function ({
	myCustomCalendar = false,
	markers,
	handleDateChange,
}: {
	myCustomCalendar?: boolean;
	markers: any;
	handleDateChange: (date: DateData) => void;
}) {
	return (
		<Calendar
			hideArrows={myCustomCalendar ? false : true}
			onDayPress={handleDateChange}
			headerStyle={{
				backgroundColor: style.primaryColor,
			}}
			markedDates={markers}
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
			renderArrow={
				myCustomCalendar
					? direction => (
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
					  )
					: undefined
			}
		/>
	);
});
