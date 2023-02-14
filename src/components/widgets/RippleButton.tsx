import React, {memo} from "react";
import {PressableProps} from "react-native";
import {style} from "../../constants/style";
import {Pressable} from "react-native";

export const RippleButton = memo((props: PressableProps) => (
	<Pressable
		android_ripple={{color: style.tertiaryColor, borderless: true}}
		style={{
			backgroundColor: style.cardColor,
			padding: 5,
			marginHorizontal: 5,
		}}
		{...props}>
		{props.children}
	</Pressable>
));
