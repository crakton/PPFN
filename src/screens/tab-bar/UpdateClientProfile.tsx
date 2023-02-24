import React, {memo, useCallback, useState} from "react";
import {View, Text, TouchableOpacity, Alert} from "react-native";
import {TextInput} from "react-native-gesture-handler";
import {ItemValue} from "@react-native-community/picker/typings/Picker";
import {Toast} from "react-native-awesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch, useSelector} from "react-redux";
import storage from "@react-native-firebase/storage";
import {useNavigation} from "@react-navigation/native";

import {style} from "../../constants/style";
import {
	bloodGroup,
	eduction,
	genotype as Genotype,
	marriageStatus,
	nokRelationship,
	religion as Religion,
} from "../../constants/staticMenus";
import updateClient from "../../apis/client/updateClient";
import {styles} from "./EditProfile";
import {RootState} from "../../types/redux.type";
import axios from "axios";
import {client} from "../../apis/endpoints";
import {getClientData} from "../../redux/user/userData";
import {Dropdown} from "../../components/Dropdown";
import {INavigateProps} from "../../interfaces";

const UpdateClientProfile = ({profileImage}: {profileImage: any}) => {
	const {client_data} = useSelector((state: RootState) => state.userData);
	const [gender, setGender] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [phone_number, setPhone] = useState<string>("");
	const [next_of_kin, setNok] = useState<string>("");
	const [blood_group, setBG] = useState<ItemValue>("");
	const [genotype, setGenotype] = useState<ItemValue>("");
	const [religion, setBelieve] = useState<ItemValue>("");
	const [education, setEducation] = useState<ItemValue>("");
	const [marital_status, setMaritalStatus] = useState<ItemValue>("");
	const [relationship_with_nok, setRelationNok] = useState<ItemValue>("");

	const {navigate} = useNavigation<{navigate: INavigateProps}>();

	const dispatch = useDispatch();
	const handleRelationNokSelection = useCallback((val: ItemValue) => {
		setRelationNok(val);
	}, []);
	const handleBGSelection = useCallback((val: ItemValue) => {
		setBG(val);
	}, []);
	const handleGenotypeSelection = useCallback((val: ItemValue) => {
		setGenotype(val);
	}, []);
	const handleReligionSelection = useCallback((val: ItemValue) => {
		setBelieve(val);
	}, []);
	const handleEducationSelection = useCallback((val: ItemValue) => {
		setEducation(val);
	}, []);
	const handleStatusSelection = useCallback((val: ItemValue) => {
		setMaritalStatus(val);
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
							{_method: "put"},
						];
						const formdata = new FormData();
						const dataTransform = dataGroup.reduce(
							(obj: string, item) => {
								let key = Object.keys(item).toString();
								let value = Object.values(item).toString();

								if (value) {
									obj += key + "=" + value + "&";
									formdata.append(key, value);
								}
								return obj;
							},
							"",
						);

						console.log(formdata);

						console.log(dataTransform);

						if (dataTransform) {
							if (profileImage) {
								await storage()
									.ref(
										`profile_images/@${client_data.id}${client_data.first_name}`,
									)
									.putFile(profileImage);
								Toast.showToast({
									message: "Successfully updated!",
									type: "success",
									duration: 2000,
								});
								navigate("profile");
							}
							const res = await updateClient(
								Number(client_data.id),
								formdata,
							);
							if (res?.status === 200) {
								axios(`${client}/single?id=${client_data.id}`)
									.then(async res => {
										await AsyncStorage.setItem(
											"user_data",
											JSON.stringify(res.data),
										);
										dispatch(getClientData(res.data));
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
							Toast.showToast({message: "Operation denied"});
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
		address,
		blood_group,
		client_data.id,
		dispatch,
		education,
		gender,
		genotype,
		marital_status,
		next_of_kin,
		phone_number,
		profileImage,
		relationship_with_nok,
		religion,
	]);

	return (
		<View style={{marginHorizontal: 5}}>
			<View>
				<Text>Gender</Text>
				<TextInput
					value={gender}
					onChangeText={val => setGender(val)}
					placeholder={client_data.gender}
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
					placeholder={client_data.phone_number}
					placeholderTextColor={style.primaryColor}
					style={styles.input}
				/>
			</View>
			<View>
				<Text>Address</Text>
				<TextInput
					value={address}
					onChangeText={val => setAddress(val)}
					placeholder={client_data.address}
					placeholderTextColor={style.primaryColor}
					style={styles.input}
				/>
			</View>
			<View>
				<Text>Next of kin Fullname</Text>
				<TextInput
					onChangeText={val => setNok(val)}
					placeholder={client_data.next_of_kin}
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
			<View>
				<Text>Blood Group</Text>
				<Dropdown
					selectedValue={blood_group}
					onChange={handleBGSelection}
					title={client_data.blood_group}
					data={bloodGroup}
				/>
			</View>
			<View>
				<Text>Genotype</Text>
				<Dropdown
					selectedValue={genotype}
					onChange={handleGenotypeSelection}
					title={client_data.genotype}
					data={Genotype}
				/>
			</View>
			<View>
				<Text>Religion</Text>
				<Dropdown
					selectedValue={religion}
					onChange={handleReligionSelection}
					title={client_data.religion}
					data={Religion}
				/>
			</View>
			<View>
				<Text>Highest Education</Text>
				<Dropdown
					selectedValue={education}
					onChange={handleEducationSelection}
					title={client_data.education}
					data={eduction}
				/>
			</View>
			<View>
				<Text>Marrital Status</Text>
				<Dropdown
					selectedValue={marital_status}
					onChange={handleStatusSelection}
					title={client_data.marital_status}
					data={marriageStatus}
				/>
			</View>

			<TouchableOpacity onPress={handleUpdate} style={styles.updateBtn}>
				<Text style={styles.updateText}>Update</Text>
			</TouchableOpacity>
		</View>
	);
};

export default memo(UpdateClientProfile);
