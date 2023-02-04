import React, {memo} from "react";
import {ScrollView, Text, View} from "react-native";
import OIcon from "react-native-vector-icons/Octicons";

import {services} from "../../constants/services";
import {style} from "../../constants/style";

const Services = memo(() => {
	return (
		<ScrollView style={{padding: 15, flex: 1}}>
			<View
				style={{
					padding: 10,
					backgroundColor: style.highlight,
					borderRadius: 10,
					marginBottom: 20,
				}}>
				{services.map((service, key) => (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							padding: 5,
						}}
						key={key}>
						<OIcon name="dot-fill" color={style.tertiaryColor} />
						<Text
							style={{color: style.tertiaryColor, marginLeft: 5}}>
							{service}
						</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);
});

export default Services;
