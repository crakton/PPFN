import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {appointment_shedules} from '../constants/appointment_shedules';
import {style} from '../constants/style';
import {WIDTH} from '../utils/dim';

export function Schedules() {
  const [selectedSchedule, setSelectedSchedule] = React.useState<number>();
  const handleSelectedSchedule = React.useCallback((val: number) => {
    setSelectedSchedule(val);
  }, []);
  return (
    <View>
      <Text
        style={{
          padding: 10,
          color: style.primaryColor,
          fontSize: 16,
          fontWeight: '500',
        }}>
        Schedule
      </Text>
      <View style={{padding: 10}}>
        {appointment_shedules.map(({time, icon}, idx) => (
          <TouchableOpacity
            key={Math.random() * idx}
            onPress={() => handleSelectedSchedule(idx)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 2,
              padding: 5,
              borderTopStartRadius: idx === 0 ? 10 : 0,
              borderTopEndRadius: idx === 0 ? 10 : 0,
              borderBottomStartRadius: idx === 3 ? 10 : 0,
              borderBottomEndRadius: idx === 3 ? 10 : 0,
              backgroundColor:
                selectedSchedule === idx ? '#FE593D' : style.titleColor,
            }}>
            <Text
              style={{
                color:
                  selectedSchedule === idx
                    ? style.cardColor
                    : style.primaryColor,
              }}>
              {time}
            </Text>
            {icon(selectedSchedule === idx ? 'heart' : 'heart-outline')}
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: style.primaryColor,
            padding: 10,
            borderRadius: 10,
            width: WIDTH / 1.5,
          }}>
          <Text
            style={{
              color: style.titleColor,
              fontWeight: '500',
              fontSize: 16,
            }}>
            Make an Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
