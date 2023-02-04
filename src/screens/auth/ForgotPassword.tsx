import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {HeaderWithBackButton} from '../../components/HeaderWithBackButton';

const ForgotPassword = memo(() => {
  const {
    navigate,
  }: {navigate: (s1: string, opt?: {}) => void; goBack: () => void} =
    useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Forgotten Password?</Text>
        <Text style={styles.description}>
          Please enter your email below to receive password reset instructions
        </Text>
        <KeyboardAvoidingView behavior="height">
          <View style={styles.bioContainer}>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={'#000'}
              style={styles.input}
              keyboardType={'email-address'}
            />

            <TouchableOpacity
              onPress={() => navigate('reset_password')}
              style={styles.reset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
});

export default ForgotPassword;
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#fff',
    flex: 1,
  },

  description: {
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 25,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {paddingBottom: 50},
  bioContainer: {
    flex: 1,
  },

  heading: {
    color: '#809FD5',
    fontWeight: '700',
    fontSize: 24,
    marginVertical: 5,
  },
  input: {
    borderBottomWidth: 1.5,
    borderColor: '#4c54af',
    color: '#333',
    paddingTop: 10,
    paddingHorizontal: 5,
  },

  reset: {
    marginTop: 200,
    flex: 1,
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    shadowColor: '#8b8b8b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  resetText: {color: '#809FD5'},
});
