import React from 'react';
import IIcon from 'react-native-vector-icons/Ionicons';
import {style} from '../constants/style';

export const appointment_shedules = [
  {
    time: '08:00 - 08:30',
    icon: (iconName: string) => (
      <IIcon name={iconName} size={20} color={style.cardColor} />
    ),
  },
  {
    time: '08:30 - 09:00',
    icon: (iconName: string) => (
      <IIcon name={iconName} size={20} color={style.cardColor} />
    ),
  },
  {
    time: '09:00 - 09:30',
    icon: (iconName: string) => (
      <IIcon name={iconName} size={20} color={style.cardColor} />
    ),
  },
  {
    time: '09:30 - 10:00',
    icon: (iconName: string) => (
      <IIcon name={iconName} size={20} color={style.cardColor} />
    ),
  },
];
