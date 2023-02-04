import React, {memo} from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import IIcon from "react-native-vector-icons/Ionicons";
import {HeaderWithBackButton} from "../../components/HeaderWithBackButton";
import {style} from "../../constants/style";
import {contacts} from "../../constants/contacts";

const Contact = memo(() => {
	return (
		<SafeAreaView style={{flex: 1}}>
			<HeaderWithBackButton goback headerTitle="Contact Us" />
			<ScrollView style={{flex: 1}}>
				{contacts.map(({location, mail, phone, region}) => (
					<View key={mail + location} style={styles.container}>
						<Text style={styles.regionText}>{region}</Text>
						<TouchableWithoutFeedback style={styles.description}>
							<IIcon
								name="location-outline"
								size={20}
								color={style.primaryColor}
							/>
							<Text style={styles.descriptionText}>{mail}</Text>
						</TouchableWithoutFeedback>
						<TouchableWithoutFeedback style={styles.description}>
							<IIcon
								name="mail"
								size={20}
								color={style.primaryColor}
							/>
							<Text style={styles.descriptionText}>{mail}</Text>
						</TouchableWithoutFeedback>
						<TouchableWithoutFeedback style={styles.description}>
							{phone && (
								<IIcon
									name="call-outline"
									size={20}
									color={style.primaryColor}
								/>
							)}
							{phone && (
								<Text style={styles.descriptionText}>
									{phone}
								</Text>
							)}
						</TouchableWithoutFeedback>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
});

export default Contact;

const styles = StyleSheet.create({
	container: {
		borderRadius: 10,
		marginHorizontal: 15,
		flexDirection: "column",
		padding: 10,
		backgroundColor: style.highlight,
		justifyContent: "center",
		marginVertical: 3,
	},
	regionText: {
		color: style.primaryColor,
		fontWeight: "500",
		padding: 5,
		textTransform: "uppercase",
	},
	description: {
		flexDirection: "row",
		alignItems: "center",
	},
	descriptionText: {
		color: style.secondaryColor,
		fontWeight: "500",
		fontSize: 12,
		padding: 7,
		marginLeft: 10,
	},
});
