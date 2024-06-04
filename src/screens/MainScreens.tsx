import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';

import Admob from '@components/Admob';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {authApi} from '@api/authApi';
import {COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN} from '../config/constants';
import * as Keychain from 'react-native-keychain';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';

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

type MainScreenProps = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MainScreens = ({navigation}: {navigation: MainScreenProps}) => {
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
              // 쿠키에 토큰 저장
              saveToken(data.token.accessToken, data.token.refreshToken);
              // Cookies.set(COOKIE_ACCESS_TOKEN, data.token.accessToken);
              // Cookies.set(COOKIE_REFRESH_TOKEN, data.token.refreshToken);
              // data.token.accessToken;
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

  const saveToken = async (token: string, retoken: string) => {
    try {
      await Keychain.setGenericPassword(COOKIE_ACCESS_TOKEN, token, {
        service: 'com.safe.access',
      });

      // 리프레시 토큰 저장
      await Keychain.setGenericPassword(COOKIE_REFRESH_TOKEN, retoken, {
        service: 'com.safe.refresh',
      });
      Alert.alert('토큰 저장', '토큰이 성공적으로 저장되었습니다');
    } catch (error) {
      console.error('토큰 저장 실패:', error);
      Alert.alert('토큰 저장 실패', '토큰을 저장하는 도중 오류가 발생했습니다');
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
