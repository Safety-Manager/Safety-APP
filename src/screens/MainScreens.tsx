import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, SafeAreaView} from 'react-native';

import Admob from '@components/Admob';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';

const MainScreens = ({navigation}: {navigation: any}) => {
  const consumerKey = '7tIhAqxaGO6m5sPqtLuD';
  const consumerSecret = 'zu1n1pbsMz';
  const appName = 'safetyapp';

  /** This key is setup in iOS. So don't touch it */
  const serviceUrlScheme = 'com.safetyapp';

  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS: serviceUrlScheme,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  const [success, setSuccessResponse] =
    useState<NaverLoginResponse['successResponse']>();

  const [failure, setFailureResponse] =
    useState<NaverLoginResponse['failureResponse']>();
  const [getProfileRes, setGetProfileRes] = useState<GetProfileResponse>();

  const login = async (): Promise<void> => {
    const {failureResponse, successResponse} = await NaverLogin.login();
    setSuccessResponse(successResponse);
    console.log('>>>', successResponse);
    getProfile(successResponse?.accessToken as string);
    setFailureResponse(failureResponse);
    console.log('>>>', failureResponse);
  };

  const getProfile = async (accessToken: string): Promise<void> => {
    try {
      const profileResult = await NaverLogin.getProfile(accessToken);
      setGetProfileRes(profileResult);
      navigation.navigate('Welcome');
    } catch (e) {
      setGetProfileRes(undefined);
    }
  };

  console.log('getProfileRes>>>', getProfileRes);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => login()}>
          <Text>카카오톡으로 시작하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreens;
