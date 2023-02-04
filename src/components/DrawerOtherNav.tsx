import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {style, styles} from '../constants/style';
import {DrawerItemsIcon} from './DrawerItemsIcon';

export function DrawerOtherNav(
  navigate: {
    <RouteName extends string>(
      ...args: RouteName extends unknown
        ? [screen: RouteName] | [screen: RouteName, params: object | undefined]
        : never
    ): void;
    <RouteName extends string>(
      options: RouteName extends unknown
        ?
            | {
                key: string;
                params?: object | undefined;
                merge?: boolean | undefined;
              }
            | {
                name: RouteName;
                key?: string | undefined;
                params: object | undefined;
                merge?: boolean | undefined;
              }
        : never,
    ): void;
  },
  index: number,
  routeNames: string[],
) {
  return (
    <View style={styles.drawerOtherNavContainer}>
      <Text style={{color: style.highlight, opacity: 0.5}}>Services</Text>

      {DrawerItemsIcon.map(({icon, name}, id) => {
        const idx = id + 3;
        const isFocused = idx === index;
        return (
          <TouchableOpacity
            key={Math.floor(Math.random() * idx) + name}
            onPress={() => navigate(routeNames[idx])}
            style={[
              {
                backgroundColor: isFocused ? style.highlight : 'transparent',
              },
              styles.drawerNavItems,
            ]}>
            {icon(isFocused ? style.primaryColor : style.highlight)}
            <Text
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: isFocused ? '500' : 'normal',
                color: isFocused ? style.primaryColor : style.highlight,
              }}>
              {name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
