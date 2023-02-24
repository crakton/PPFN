import React, {memo, useCallback, useState} from "react";
import {View, Text, TouchableOpacity, Alert, Platform} from "react-native";
import {TextInput} from "react-native-gesture-handler";
import {ItemValue} from "@react-native-community/picker/typings/Picker";
import {Toast} from "react-native-awesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import storage from "@react-native-firebase/storage";

import {
	genotype as Genotype,
	nokRelationship,
} from "../../constants/staticMenus";
import updateProvider from "../../apis/client/updateProvider";
import {style} from "../../constants/style";
import {styles} from "./EditProfile";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../types/redux.type";
import axios from "axios";
import {provider} from "../../apis/endpoints";
import {getProviderData} from "../../redux/user/userData";
import {INavigateProps} from "../../interfaces";
import {Dropdown} from "../../components/Dropdown";

const UpdateProviderProfile = ({profileImage}: {profileImage: string}) => {
	const {provider_data} = useSelector((state: RootState) => state.userData);
	const [gender, setGender] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [phone_number, setPhone] = useState<string>("");
	const [next_of_kin, setNok] = useState<string>("");
	const [blood_group, setBG] = useState<string>("");
	const [genotype, setGenotype] = useState<string>("");
	const [religion, setBelieve] = useState<string>("");
	const [education, setEducation] = useState<string>("");
	const [marital_status, setMaritalStatus] = useState<string>("");
	const [relationship_with_nok, setRelationNok] = useState<ItemValue>("");
	const dispatch = useDispatch();
	const {navigate} = useNavigation<{navigate: INavigateProps}>();
	const handleRelationNokSelection = useCallback((val: ItemValue) => {
		setRelationNok(val);
	}, []);

	const handleUpdate = useCallback(() => {
		Alert.alert("Update profile", "Do you want to make these changes?", [
			{
				text: "confirm",
				onPress: async () => {
					try {
						const dataGroup = [
							{next_of_kin},
							{blood_group},
							{religion},
							{genotype},
							{marital_status},
							{education},
							{address},
							{relationship_with_nok},
							{phone_number},
							{gender},
						];

						const dataTransform = dataGroup.reduce(
							(obj: {}, item) => {
								let key = Object.keys(item).toString();
								let value = Object.values(item).toString();

								if (value) {
									obj[key] = value;
								}
								return obj;
							},
							{},
						);

						if (Object.keys(dataTransform).length) {
							if (profileImage) {
								await storage()
									.ref(
										`profile_images/@${provider_data.id}${provider_data.first_name}`,
									)
									.putFile(profileImage);
							}
							const res = await updateProvider(
								Number(provider_data.id),
								dataTransform,
							);
							if (res?.status === 200) {
								axios(
									`${provider}/single?id=${provider_data.id}`,
								)
									.then(async res => {
										await AsyncStorage.setItem(
											"provider_data",
											JSON.stringify(res.data),
										);
										dispatch(getProviderData(res.data));
										Toast.showToast({
											message: "Successfully updated!",
											type: "success",
											duration: 2000,
										});
										navigate("profile");
									})
									.catch(err => {
										console.log(err);
									});
							}
						} else {
							Toast.showToast({
								message: "Operation denied",
								type: "warning",
							});
						}
					} catch (error: any) {
						if (error.message === "Network Error") {
							Toast.showToast({
								message: "Network!",
								type: "warning",
							});
						}
						console.log(JSON.stringify(error));
					}
				},
			},
			{
				text: "cancel",
			},
		]);
	}, [
		next_of_kin,
		blood_group,
		dispatch,
		religion,
		genotype,
		marital_status,
		education,
		address,
		relationship_with_nok,
		phone_number,
		gender,
		provider_data.id,
		profileImage,
	]);

	return (
		<View style={{marginHorizontal: 5}}>
			<View>
				<Text>Gender</Text>
				<TextInput
					value={gender}
					onChangeText={val => setGender(val)}
					placeholder={provider_data.gender}
					placeholderTextColor={style.primaryColor}
					style={styles.input}
				/>
			</View>
			<View>
				<Text>Phone number</Text>
				<TextInput
					value={phone_number}
					keyboardType={"phone-pad"}
					maxLength={14}
					onChangeText={val => setPhone(val)}
					placeholder={provider_data.phone_number}
					placeholderTextColor={style.primaryColor}
					style={styles.input}
				/>
			</View>
			<View>
				<Text>Address</Text>
				<TextInput
					value={address}
					onChangeText={val => setAddress(val)}
					placeholder={provider_data.address}
					placeholderTextColor={style.primaryColor}
					style={styles.input}
				/>
			</View>
			<View>
				<Text>Next of kin Fullname</Text>
				<TextInput
					onChangeText={val => setNok(val)}
					placeholder={provider_data.next_of_kin}
					placeholderTextColor={style.primaryColor}
					style={styles.input}
				/>
			</View>
			<View>
				<Text>NoK</Text>
				<Dropdown
					selectedValue={relationship_with_nok}
					onChange={handleRelationNokSelection}
					title="Relationship with Next of Kin"
					data={nokRelationship}
				/>
			</View>

			<TouchableOpacity onPress={handleUpdate} style={styles.updateBtn}>
				<Text style={styles.updateText}>Update</Text>
			</TouchableOpacity>
		</View>
	);
};

export default memo(UpdateProviderProfile);
