import {StyleSheet, TextInput, View} from "react-native";
import Icon from "react-native-vector-icons/Fontisto";
import {style} from "../../constants/style";

export const Input = ({placeholder = "", secure = false}) => (
	<TextInput
		secureTextEntry={secure}
		placeholder={placeholder}
		placeholderTextColor={style.primaryColor}
		keyboardType="visible-password"
		style={styles.input}
	/>
);

const styles = StyleSheet.create({
	input: {
		marginTop: 10,
		marginBottom: 10,
		borderBottomWidth: 1.5,
		borderColor: style.primaryColor,
		color: style.primaryColor,
		paddingTop: 10,
		paddingHorizontal: 16,
		fontFamily: "AltonaSans-Regular",
		fontSize: 18,
	},
});
