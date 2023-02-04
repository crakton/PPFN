import {
  TouchableOpacity,
  StyleSheet,
  Text,
  GestureResponderEvent,
} from 'react-native';
import React from 'react';
import {style} from '../../constants/style';

export function LargeSubmitFormBtn({
  text,
  onPress,
}: {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.login}>
      <Text style={styles.loginText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  login: {
    marginTop: 20,
    marginBottom: 40,
    flex: 1,
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: style.highlight,
    shadowColor: style.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  loginText: {color: style.tertiaryColor,fontSize: 16},
});
