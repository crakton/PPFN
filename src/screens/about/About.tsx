import React, {memo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {style} from '../../constants/style';

const About = memo(() => {
	return (
		<ScrollView style={{padding: 15, flex: 1}}>
			<View
				style={{
					padding: 10,
					backgroundColor: style.highlight,
					borderRadius: 10,
					marginBottom: 20,
				}}
			>
				<Text
					style={{
						lineHeight: 20,
						textAlign: 'justify',
						color: style.tertiaryColor,
					}}
				>
					The original core mission of PPFN, a private, not-for-profit
					organization founded in the late 1950s, was to promote adoption of
					child spacing and contraceptive practices among individuals and
					couples. Over the years, PPFN has evolved from this initial narrow
					emphasis to a broader, more comprehensive mission which takes on board
					the implications and needs arising from ICPD, the Beijing
					International Women’s Conference, the concern with adolescent RH, and
					the HIV/AIDS pandemic. The resulting package of activities and
					services focuses on adolescents and young people, designed to promote,
					protect and enhance their SRH and rights along with those of adults.
					Through participation of PPFN’s National Executive Committee (NEC)
					members, senior national, zonal and state management and staff, as
					well as partners (government, NGOs within and outside SRH, the private
					sector and donors) we made the strategic review and planning process
					as participatory and inclusive as it could possibly be. While the plan
					provides an internal source of direction, shared values, and a basis
					for concerted action, we hope that it will also inform and enlighten
					our partners, supporters and donors so that together we can continue
					to work harmoniously to enhance SRH and rights in Nigeria and indeed
					Africa as a whole.
				</Text>
			</View>
		</ScrollView>
	);
});

export default About;
