import { memo } from "react";
import { ActivityIndicator, View } from "react-native";
import { style } from "../../constants/style";

export default memo(() => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
	<ActivityIndicator size={48} color={style.primaryColor} />
</View>
)
