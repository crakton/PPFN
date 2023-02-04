import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { style } from '../constants/style';
import { SetFetchTypeProps } from '../interfaces';

function SetFetchType({
  fetchTypes,
  activeFetchType,
  setFetchType,
}: SetFetchTypeProps) {
  return (
    <View style={styles.container}>
      {fetchTypes.map((item: string, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => setFetchType(item)}
          style={
            activeFetchType === item ? styles.activeType : styles.inactiveType
          }>
          <Text
            style={
              activeFetchType === item
                ? styles.activeInnerText
                : styles.innerText
            }>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: style.cardColor,
    borderRadius: 10,
    flexDirection: 'row',
    marginVertical: 20,
  },
  inactiveType: {
    padding: 12,
    textAlign: 'center',
    flex: 1,
  },
  activeType: {
    padding: 10,
    flex: 1,
    borderRadius: 10,
    backgroundColor: style.primaryColor,
    elevation: 12,
  },
  innerText: {
    textAlign: 'center',
    fontFamily: 'AltonaSans-Regular',
    color: style.titleColor,
  },
  activeInnerText: {
    textAlign: 'center',
    fontFamily: 'AltonaSans-Regular',
    color: style.highlight,
  },
});

export default React.memo(SetFetchType);
