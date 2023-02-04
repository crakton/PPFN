import {
	View,
	TouchableOpacity,
	TextInput,
	FlatList,
	Image,
	Text,
	SafeAreaView,
	ScrollView,
} from "react-native";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import React, {memo, useMemo, useState} from "react";
import {INavigateProps, SearchBarProps} from "../interfaces";
import {style} from "../constants/style";
import {useSelector} from "react-redux";
import {RootState} from "../types/redux.type";
import IListProvider from "../interfaces/listProvider";
import {useNavigation} from "@react-navigation/native";

export default memo(function ({
	placeholder = "",
	value = "",
	handleChange,
}: SearchBarProps) {
	const {navigate}: {navigate: INavigateProps} = useNavigation();

	const providers = useSelector((state: RootState) => state.provider);
	const hits = useMemo(() => {
		const _hits: IListProvider[] = [];
		if (value) {
			providers.map((provider, _, __) => {
				if (
					provider.first_name?.includes(value) ||
					provider.last_name?.includes(value) ||
					provider.facility?.includes(value) ||
					provider.category?.includes(value)
				) {
					_hits.push(provider);
				}
			});
			return _hits;
		}
	}, [value]);

	return (
		<SafeAreaView>
			<View
				style={{
					flexDirection: "row",
					padding: 5,
					alignItems: "center",
					borderWidth: 1.5,
					borderRadius: 10,
					borderColor: style.primaryColor,
					// marginVertical: 20,
				}}>
				<TouchableOpacity style={{borderRadius: 1000}}>
					<MCIcon
						color={style.primaryColor}
						name="magnify"
						size={24}
					/>
				</TouchableOpacity>
				<TextInput
					value={value}
					onChangeText={text => handleChange(text)}
					placeholder={placeholder}
					style={{
						flex: 1,
						height: 35,
						marginLeft: 5,
						color: style.primaryColor,
						padding: 5,
						fontFamily: "AltonaSans-Italic",
						fontSize: 16,
						fontWeight: "500",
					}}
				/>
			</View>
			{hits ? (
				<FlatList
					style={{maxHeight: 170}}
					data={hits}
					renderItem={({item}) => (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginHorizontal: 1.5,
								marginVertical: 5,
								backgroundColor: style.cardColor,
								elevation: 12,
								borderRadius: 10,
								padding: 10,
							}}>
							<Image
								style={{
									width: 50,
									height: 50,
									borderRadius: 100,
								}}
								source={require("../assets/images/logo.png")}
							/>
							<TouchableOpacity
								onPress={() =>
									navigate("doctor_appointment", item)
								}
								style={{marginLeft: 10}}>
								<Text
									style={{
										fontFamily: "AltonaSans-Regular",
										fontSize: 20,
										color: style.primaryColor,
									}}>{`${item.first_name} ${item.last_name}`}</Text>
								<Text
									style={{
										fontFamily: "AltonaSans-Regular",
										color: style.tertiaryColor,
										backgroundColor: style.highlight,
										padding: 5,
										borderRadius: 5,
									}}>
									{item.facility}
								</Text>
								<Text
									style={{
										fontFamily: "AltonaSans-Regular",
										color: style.primaryColor,
										fontSize: 16,
									}}>
									{item.category}
								</Text>
							</TouchableOpacity>
						</View>
					)}
				/>
			) : null}
		</SafeAreaView>
	);
});
