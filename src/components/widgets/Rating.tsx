import {View} from 'react-native';
import React from 'react';
import {style} from '../../constants/style';

export function Rating({rate, max}: {rate: number; max: number}) {
  const dots = new Array(max).fill(null);
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      {dots.map((_item, i) => (
        <View
          key={(i + 1) * Math.random()}
          style={{
            padding: 5,
            borderRadius: 99,
            backgroundColor:
              rate >= i + 1 ? style.tertiaryColor : style.highlight,
          }}
        />
      ))}
    </View>
  );
}
