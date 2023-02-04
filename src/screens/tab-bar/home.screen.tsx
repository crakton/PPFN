import React, {memo, useEffect, useMemo, useState} from "react";
import providerByPopularity from "../../utils/providersByPopularity";
import {useSelector} from "react-redux";
import {View, FlatList} from "react-native";
//navigators

//types, interfaces and utils
import IClientData from "../../interfaces/clientData";
import IProviderData from "../../interfaces/providerData";
import IListProvider from "../../interfaces/listProvider";
import whichSignedUser from "../../utils/whichSignedUser";
import providersNearYou from "../../utils/providersNearYou";
import {RootState} from "../../types/redux.type";
import {homeFetchTypes} from "../../constants/staticMenus";

//screens
import DoctorAppointment from "./DoctorAppointment";

//components
import ActivityLoader from "../../components/widgets/ActivityLoader";
import DefaultText from "../../components/widgets/DefaultText";
import HomeDoctorListItem from "../../components/HomeDoctorListItem";
import SearchBar from "../../components/SearchBar";
import SetFetchType from "../../components/SetFetchType";
import Layout from "../../layouts/DrawerScreenLayout";
import ProviderHome from "./ProviderHome";
import {useNavigation} from "@react-navigation/native";
import {INavigateProps} from "../../interfaces";
import {Stack} from "../../navigations/stack.navigation";
import {Toast} from "react-native-awesome";

const Home = memo(() => {
	const calls = new Map();
	const {navigate} = useNavigation<{navigate: INavigateProps}>();

	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="home_main" component={HomeLayout} />
			<Stack.Screen
				name="doctor_appointment"
				component={DoctorAppointment}
			/>
		</Stack.Navigator>
	);
});

const RenderListProviders = ({item}: {item: IListProvider}) => (
	<HomeDoctorListItem {...item} />
);
function HomeLayout(): JSX.Element {
	const [searchQuery, setSearchQuery] = useState("");
	const [fetchType, setFetchType] = useState("All");
	const handleChangeSearchQuery = (txt: string) => setSearchQuery(txt);
	const providers = useSelector((state: RootState) => state.provider);
	const {client_data, provider_data} = useSelector(
		(state: RootState) => state.userData,
	);
	const [whichUser, setWhichUser] = useState<{
		data: IClientData | IProviderData;
		user: string;
	}>({
		user: "",
		data: {
			address: "",
			blood_group: "",
			category: "",
			city: "",
			date_of_birth: "",
			doctorSlot: {data: [{available: false, time: ""}]},
			education: "",
			email: "",
			experience: "",
			facility: "",
			first_name: "",
			gender: "",
			genotype: "",
			geo_location: "",
			geolocation: "",
			hash: "",
			height: "",
			id: "",
			image: "",
			insurar_name: "",
			last_login: "",
			last_name: "",
			marital_status: "",
			nationalID: "",
			next_of_kin: "",
			phone_number: "",
			photo: "",
			photo_error: "",
			photo_name: "",
			photo_path: "",
			photo_size: "",
			photo_type: "",
			rating: 0,
			regdate: "",
			relationship_with_nok: "",
			religion: "",
			status: "",
			system_user: "",
			state: "",
			t1: "",
			t2: "",
			t3: "",
			t4: "",
			t5: "",
			t6: "",
			t7: "",
			t8: "",
			t9: "",
			t10: "",
			t11: "",
			t12: "",
			t13: "",
			t14: "",
			t15: "",
			t16: "",
			t17: "",
			t18: "",
			t19: "",
			t20: "",
			t21: "",
			t22: "",
			t23: "",
			title: "",
			weight: "",
		},
	});

	useEffect(() => {
		(async () => {
			try {
				const user = await whichSignedUser();
				setWhichUser({
					user,
					data: user === "client" ? client_data : provider_data,
				});
			} catch (error: any) {
				if (error === "Network Error") {
					Toast.showToast({
						message:
							"There is a problem with your network connection!",
					});
				}
				console.log(error);
			}
		})();
	}, [client_data, provider_data]);

	const providersNY = useMemo(
		() => providersNearYou(providers, whichUser?.data.state),
		[providers, whichUser?.data.state],
	);
	const providersByPopularity = useMemo(
		() => providerByPopularity(providers),
		[providers],
	);
	if (whichUser === undefined) {
		return <ActivityLoader />;
	}
	return whichUser.user === "provider" ? (
		<ProviderHome />
	) : (
		<Layout
			title={`Welcome, ${whichUser.data.first_name}`}
			subtitle="How are you today?">
			<View style={{paddingHorizontal: 15}}>
				<SearchBar
					placeholder="Let's find a service provider."
					value={searchQuery}
					handleChange={handleChangeSearchQuery}
				/>
				<SetFetchType
					fetchTypes={homeFetchTypes}
					activeFetchType={fetchType}
					setFetchType={setFetchType}
				/>
			</View>
			{fetchType === "All" && providers[0].first_name ? (
				<FlatList
					refreshing
					contentContainerStyle={{paddingHorizontal: 15}}
					data={providers}
					keyExtractor={(_, id) => id.toString()}
					renderItem={RenderListProviders}
					initialNumToRender={15}
					maxToRenderPerBatch={10}
				/>
			) : (
				<></>
			)}
			{fetchType === "Near You" ? (
				providersNY.length ? (
					<FlatList
						contentContainerStyle={{paddingHorizontal: 15}}
						showsVerticalScrollIndicator={false}
						data={providersNY}
						keyExtractor={(_, id) => id.toString()}
						renderItem={RenderListProviders}
						initialNumToRender={5}
					/>
				) : (
					<DefaultText text="No Provider closer to you." />
				)
			) : null}
			{fetchType === "Popular" ? (
				providersByPopularity.length ? (
					<FlatList
						contentContainerStyle={{paddingHorizontal: 15}}
						showsVerticalScrollIndicator={false}
						data={providersByPopularity}
						keyExtractor={(_, id) => id.toString()}
						renderItem={RenderListProviders}
						initialNumToRender={5}
					/>
				) : (
					<DefaultText text="No popular Provider yet." />
				)
			) : null}
		</Layout>
	);
}

export default Home;
