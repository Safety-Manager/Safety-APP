import React from 'react';
import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';
import AppleLogo from '@assets/icons/AppleLogo.png'; // Make sure you have an Apple logo image

function AppleLogin({handleSignInApple}: {handleSignInApple: () => void}) {
  return (
    <Pressable onPress={handleSignInApple} style={styles.loginContainer}>
      <Image source={AppleLogo} style={styles.loginIcon} resizeMode="contain" />
      <Text style={styles.loginText}>Apple로 계속하기</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    width: '70%',
    height: 50,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: 20,
  },
  loginIcon: {
    height: 36,
    width: 36,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#fff',
  },
});

export default AppleLogin;
