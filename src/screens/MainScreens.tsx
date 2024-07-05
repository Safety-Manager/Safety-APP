import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import NaverLogin, {
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {authApi} from '@api/authApi';
import {COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN} from '../config/constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppleLogin from '@components/AppleLogin';
import appleAuth from '@invertase/react-native-apple-authentication';
import {RootStackParamList, RouteNames} from '@components/Route';
import HomeImg from '@assets/images/Home.png';
import SearchIcon from '@assets/icons/Search.png';
import SafetyIcon from '@assets/icons/Safety.png';
import CommunityIcon from '@assets/icons/Community.png';
import NaverIcon from '@assets/icons/Naver.png';

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

type MainScreenProps = NativeStackNavigationProp<RootStackParamList>;

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
            mobile: profileResult.response.mobile?.replace(/-/g, '') as string,
            nickname: profileResult.response.nickname as string,
            platform: 'naver',
          },
          {
            onSuccess: async (data: any) => {
              // Save tokens in AsyncStorage
              await AsyncStorage.setItem(
                COOKIE_ACCESS_TOKEN,
                data.token.accessToken,
              );

              await AsyncStorage.setItem(
                COOKIE_REFRESH_TOKEN,
                data.token.refreshToken,
              );

              navigation.navigate(RouteNames.HOMETABS);
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
    try {
      // Apple login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Check user credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // Handle successful authentication
      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('appleAuthRequestResponse>>>>', appleAuthRequestResponse);
        const user = {
          id: appleAuthRequestResponse.user,
          email: appleAuthRequestResponse.email || '',
          name: appleAuthRequestResponse.fullName?.givenName || '',
          mobile: '',
          nickname: appleAuthRequestResponse.fullName?.givenName || '',
          platform: 'apple',
          identityToken: appleAuthRequestResponse.identityToken,
          authorizationCode: appleAuthRequestResponse.authorizationCode,
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
            navigation.navigate(RouteNames.HOME);
          },
          onError: (error: any) => {
            console.log('error>>>', error);
          },
        });
      }
    } catch (error) {
      console.error('Apple sign-in failed', error);
    }
  };

  return (
    <ScrollView style={styles.safeArea}>
      <ImageBackground
        style={styles.rectangleImage}
        resizeMode="cover"
        source={HomeImg}
        imageStyle={styles.image}>
        <View style={styles.contentContainer}>
          <Text style={styles.mainText}>안전 파트너</Text>
          <Text style={styles.imagetext}>
            쉽고 빠르게! 안전 법규와 함께 안전을 지키세요!
          </Text>
        </View>
      </ImageBackground>
      <View style={styles.content}>
        <View style={{flexDirection: 'row', gap: 10, width: '100%'}}>
          <View style={styles.cardContainer}>
            <Image
              source={SearchIcon}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>법령 빠른 검색</Text>
          </View>
          <View style={styles.cardContainer}>
            <Image
              source={CommunityIcon}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>커뮤니티</Text>
          </View>
        </View>
        <View style={styles.columnContainer}>
          <View style={styles.cardContainer}>
            <Image
              source={SafetyIcon}
              style={styles.cardIcon}
              resizeMode="contain"
            />
            <Text style={styles.cardText}>안전 교육 매칭</Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <Pressable onPress={() => login()} style={styles.loginContainer}>
          <Image
            source={NaverIcon}
            style={styles.loginIcon}
            resizeMode="contain"
          />
          <Text style={styles.loginText}>네이버로 계속하기</Text>
        </Pressable>
        {Platform.OS === 'ios' && (
          <AppleLogin handleSignInApple={handleSignInApple} />
        )}
      </View>
      <Text style={styles.footerText}>
        안전 파트너에 가입함으로써{' '}
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL('https://example.com/terms')}>
          이용약관
        </Text>
        및
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL('https://example.com/privacy')}>
          개인정보처리방침
        </Text>
        에 동의하게 됩니다.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  rectangleImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
  },
  image: {
    opacity: 0.6,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  mainText: {
    fontFamily: 'NotoSansCJKkr-Bold',
    fontSize: 36,
    letterSpacing: -1,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 10,
  },
  imagetext: {
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    marginTop: 20,
    marginHorizontal: 30,
  },
  cardContainer: {
    width: '48%',
    height: 100,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
      },
      android: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 3,
      },
    }),
  },
  cardIcon: {
    height: 24,
    width: 24,
    marginBottom: 10,
    tintColor: 'black',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#211a0a',
  },
  columnContainer: {
    flexDirection: 'column',
    gap: 10,
    marginVertical: 10,
  },
  additionalFeaturesText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#211a0a',
  },
  loginContainer: {
    width: '70%',
    height: 50,
    backgroundColor: '#03C75A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
  },
  loginIcon: {
    height: 34,
    width: 34,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#fff',
  },
  footerText: {
    margin: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  linkText: {
    color: 'blue',
  },
});

export default MainScreens;
