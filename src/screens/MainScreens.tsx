import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, SafeAreaView} from 'react-native';

import Admob from '@components/Admob';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {authApi} from '@api/userApi';

type userInfoType = {
  message: string;
  response: {
    id: string;
    email: string;
    name: string;
    mobile: string;
    nickname: string;
  };
};

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

  const mutateJoin = authApi.PostJoin();

  const login = async (): Promise<void> => {
    const {failureResponse, successResponse} = await NaverLogin.login();
    setSuccessResponse(successResponse);

    getProfile(successResponse?.accessToken as string);
    setFailureResponse(failureResponse);
  };

  const getProfile = async (accessToken: string): Promise<void> => {
    try {
      const profileResult = await NaverLogin.getProfile(accessToken);
      if (profileResult.message === 'success') {
        mutateJoin.mutate(
          {
            id: profileResult.response.id,
            email: profileResult.response.email,
            name: profileResult.response.name,
            hpno: profileResult.response.mobile?.replace(/-/g, '') as string,
            nickname: profileResult.response.nickname as string,
            platform: 'naver ',
          },
          {
            onSuccess: (data: any) => {
              console.log('data>>>', data);

              navigation.navigate('Home');
            },
            onError: (error: any) => {
              console.log('error>>>', error);
            },
          },
        );
      }
    } catch (e) {
      setGetProfileRes(undefined);
    }
  };

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
