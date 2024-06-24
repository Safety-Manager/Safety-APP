import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';

import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {authApi} from '@api/authApi';
import {COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN} from '../config/constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppleLogin from '@components/AppleLogin';
import appleAuth from '@invertase/react-native-apple-authentication';

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
            onSuccess: async (data: any) => {
              // 쿠키에 토큰 저장
              await AsyncStorage.setItem(
                COOKIE_ACCESS_TOKEN,
                data.token.accessToken,
              );

              await AsyncStorage.setItem(
                COOKIE_REFRESH_TOKEN,
                data.token.refreshToken,
              );

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

  const handleSignInApple = async () => {
    // 애플 로그인 요청
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // 사용자 인증 상태 확인
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // 사용자 인증 성공 시 처리
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const user = {
        id: appleAuthRequestResponse.user,
        email: appleAuthRequestResponse.email!,
        name: appleAuthRequestResponse.fullName!.givenName!,
        hpno: '',
        nickname: appleAuthRequestResponse.fullName!.givenName!,
        platform: 'apple',
      };

      mutateJoin.mutate(user, {
        onSuccess: async (data: any) => {
          await AsyncStorage.setItem(
            COOKIE_ACCESS_TOKEN,
            data.token.accessToken,
          );
          await AsyncStorage.setItem(
            COOKIE_REFRESH_TOKEN,
            data.token.refreshToken,
          );
          navigation.navigate('Home');
        },
        onError: (error: any) => {
          console.log('error>>>', error);
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => login()}>
          <Text>카카오톡으로 시작하기</Text>
        </Pressable>
        {Platform.OS === 'ios' && (
          <AppleLogin handleSignInApple={handleSignInApple} />
        )}
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
