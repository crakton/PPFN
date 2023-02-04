import {Picker} from "@react-native-community/picker";
import {ItemValue} from "@react-native-community/picker/typings/Picker";
import React from "react";
import {style} from "../constants/style";

export const Dropdown = ({
	data,
	onChange,
	selectedValue,
	mode = "dialog",
	title = "Dialog",
}: {
	data: any[];
	onChange: (item: ItemValue) => void;
	selectedValue: ItemValue;
	mode?: "dialog" | "dropdown" | undefined;
	title: string;
}) => {
	return (
		<Picker
			prompt={title}
			mode={mode}
			onValueChange={onChange}
			selectedValue={selectedValue}>
			{data?.map((datum: string) => (
				<Picker.Item
					color={style.tertiaryColor}
					key={datum}
					value={datum}
					label={datum}
				/>
			))}
		</Picker>
	);
};
