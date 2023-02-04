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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import IIcon from 'react-native-vector-icons/Ionicons';
import {style} from '../../constants/style';

const ResetPassword = memo(() => {
  const {
    goBack,
  }: {navigate: (s1: string, opt?: {}) => void; goBack: () => void} =
    useNavigation();

  const [password, setPassword] = React.useState<string>();
  const [confirmPassword, setConfirmPassword] = React.useState<string>();
  const [hidePassword, setHidePassword] = React.useState<boolean>(true);

  const opt_2_ref = React.useRef<TextInput>(null);
  const opt_3_ref = React.useRef<TextInput>(null);
  const opt_4_ref = React.useRef<TextInput>(null);
  const opt_5_ref = React.useRef<TextInput>(null);
  const opt_6_ref = React.useRef<TextInput>(null);
  const confirmPasswordRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const handleBlur = React.useCallback(() => {
    if (confirmPassword !== password) {
      setPassword('');
      setConfirmPassword('');
      passwordRef.current?.focus();
    }
  }, [confirmPassword, password]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => goBack()}>
          <IIcon name="arrow-back-sharp" size={22} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <IIcon name="ellipsis-horizontal-sharp" size={22} />
        </TouchableWithoutFeedback>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Recovery Password</Text>
        <Text style={styles.description}>
          Reset code was sent to your email. Please enter the code to reset your
          password
        </Text>
        <View style={styles.inputGroups}>
          <TextInput
            onTextInput={() => opt_2_ref.current?.focus()}
            style={styles.inputGroup}
            maxLength={1}
            placeholderTextColor={'#000'}
            placeholder="*"
          />
          <TextInput
            ref={opt_2_ref}
            onTextInput={() => opt_3_ref.current?.focus()}
            style={styles.inputGroup}
            maxLength={1}
            placeholderTextColor={'#000'}
            placeholder="*"
          />
          <TextInput
            ref={opt_3_ref}
            onTextInput={() => opt_4_ref.current?.focus()}
            style={styles.inputGroup}
            maxLength={1}
            placeholderTextColor={'#000'}
            placeholder="*"
          />
          <TextInput
            ref={opt_4_ref}
            onTextInput={() => opt_5_ref.current?.focus()}
            style={styles.inputGroup}
            maxLength={1}
            placeholderTextColor={'#000'}
            placeholder="*"
          />
          <TextInput
            ref={opt_5_ref}
            onTextInput={() => opt_6_ref.current?.focus()}
            style={styles.inputGroup}
            maxLength={1}
            placeholderTextColor={'#000'}
            placeholder="*"
          />
          <TextInput
            ref={opt_6_ref}
            style={styles.inputGroup}
            maxLength={1}
            placeholderTextColor={'#000'}
            placeholder="*"
          />
        </View>
        <KeyboardAvoidingView behavior="height">
          <View style={styles.bioContainer}>
            <View style={styles.passwordGroup}>
              <TextInput
                value={password}
                placeholder="Password"
                placeholderTextColor={'#000'}
                onChangeText={val => setPassword(val)}
                secureTextEntry={hidePassword}
                style={[styles.input, {flex: 1, borderBottomWidth: 0}]}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                blurOnSubmit={false}
              />
              <TouchableWithoutFeedback
                onPress={() => setHidePassword(prev => !prev)}>
                <FaIcon
                  name={hidePassword ? 'eye' : 'eye-slash'}
                  color={style.highlight}
                  size={20}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.passwordGroup}>
              <TextInput
                ref={confirmPasswordRef}
                value={confirmPassword}
                placeholder="Confirm Password"
                onBlur={handleBlur}
                placeholderTextColor={'#000'}
                onChangeText={val => setConfirmPassword(val)}
                secureTextEntry={hidePassword}
                style={[styles.input, {flex: 1, borderBottomWidth: 0}]}
              />
              <TouchableWithoutFeedback
                onPress={() => setHidePassword(prev => !prev)}>
                <FaIcon
                  name={hidePassword ? 'eye' : 'eye-slash'}
                  color={style.highlight}
                  size={20}
                />
              </TouchableWithoutFeedback>
            </View>
            <TouchableOpacity style={styles.reset}>
              <Text style={styles.resetText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableWithoutFeedback style={styles.resend}>
              <Text style={styles.resendText}>
                Didn't receive code? Click to resend
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
});

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    paddingTop: 10,
    paddingHorizontal: 20,
    marginBottom: 60,
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
  passwordGroup: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderColor: '#4c54af',
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
  inputGroups: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    borderColor: '#ddd',
    borderWidth: 2,
    width: 30,
    height: 30,
    borderRadius: 10,
    padding: 0,
    textAlign: 'center',
    justifyContent: 'center',
  },
  reset: {
    marginTop: 100,
    flex: 1,
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    shadowColor: '#ADB6B3',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  resetText: {color: '#809FD5'},
  resend: {marginTop: 20},
  resendText: {color: '#ADB6B3'},
});
