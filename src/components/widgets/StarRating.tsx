import {View, Dimensions} from 'react-native';
import React from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';

export function StarRating({
  rate,
  max,
  color,
}: {
  rate: number;
  max: number;
  color?: string;
}) {
  const dots = new Array(max).fill(null);
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginRight: 15,
        width: Dimensions.get('screen').width / 2.8,
      }}>
      {dots.map((_item, i) => (
        <View style={{flex: 1}} key={(i + 1) * Math.random()}>
          <AntIcon
            color={`${rate >= i + 1 ? (color ? color : 'gold') : 'grey'}`}
            name="star"
          />
        </View>
      ))}
    </View>
  );
}
