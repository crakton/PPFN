import {
	SafeAreaView,
	View,
	Text,
	ScrollView,
	ImageBackground,
	StyleSheet,
} from 'react-native';
import { ProfileLayoutProps } from '../interfaces';
import { style } from '../constants/style';
import { HeaderWithBackButton } from '../components/HeaderWithBackButton';
import { HEIGHT } from '../utils/dim';
import { memo, } from 'react';

function ProfileLayout({
	children,
	profileImage,
	profileImageBtn,
	showRegisteredDateAndName,
	userName,
	registeredDate,
	edit,
	backBtn,
}: ProfileLayoutProps) {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView>

				<ImageBackground
					style={{ height: HEIGHT / 2 }}
					source={
						profileImage
							? { uri: profileImage }
							: require('../assets/images/fallback_1.jpg')

					}>
					{backBtn && <HeaderWithBackButton goback />}
				</ImageBackground>
				{edit && (
					<View
						style={{
							flexDirection: 'row',
							marginTop: -20,
							justifyContent: 'flex-end',
						}}>
						{profileImageBtn}
					</View>
				)}
				<View style={{ marginHorizontal: 15, marginTop: edit ? 0 : 7 }}>
					{showRegisteredDateAndName && (
						<View>
							<Text style={styles.fullname}>{userName}</Text>
							<Text style={styles.geoContactEmail}>{registeredDate}</Text>
						</View>
					)}
				</View>
				<View style={styles.propContainer}>{children}</View>
			</ScrollView>
		</SafeAreaView>
	);
}
export default memo(ProfileLayout);

const styles = StyleSheet.create({
	propContainer: {
		paddingHorizontal: 10,
		flex: 1,
	},
	geoContactEmail: {
		fontFamily: 'AltonaSans-Italic',
		color: style.titleColor,
		marginBottom: 5,
	},
	fullname: {
		color: style.primaryColor,
		fontFamily: 'AltonaSans-Regular',
		fontSize: 22,
		fontWeight: '500',
		textTransform: 'capitalize',
	},
});
