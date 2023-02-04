import React from 'react';
import IIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const DrawerItemsIcon = [
  // {
  //   name: 'Training',
  //   icon: (iconsStyle: string) => (
  //     <MCIcon name="brain" size={24} color={iconsStyle} />
  //   ),
  // },
  {
    name: 'Contact Us',
    icon: (iconsStyle: string) => (
      <IIcon name="call-outline" size={24} color={iconsStyle} />
    ),
  },
  {
    name: 'About Us',
    icon: (iconsStyle?: string) => (
      <MCIcon name="information-outline" size={24} color={iconsStyle} />
    ),
  },
];
