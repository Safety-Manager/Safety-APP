import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Person from '@assets/icons/Person.svg';
import RightIcon from '@assets/icons/Right.svg';
import {authApi} from '@api/authApi';
import {navigate} from '@utils/navigationRef';
import {RootStackParamList, RouteNames} from '@components/Route';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTypes} from 'types/auth';
import CustomModal from '@components/CustomModal';
import {COOKIE_ACCESS_TOKEN} from '@config/constants';
import {WebView} from 'react-native-webview';

const myTab = [
  '개인정보 처리방침',
  '약관 및 정책',
  '내 게시글',
  // '저장한 게시글',
  '로그아웃',
  '탈퇴하기',
];

type ScreenProps = NativeStackNavigationProp<RootStackParamList>;

const MyPageScreens = () => {
  const navigation: ScreenProps = useNavigation(); // Use the useNavigation hook to access the navigation object

  const [user, setUser] = useState<UserTypes | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    onConfirm: () => void;
  }>({
    title: '',
    onConfirm: () => {},
  });

  const {mutate: deleteUser} = authApi.DeleteUser();

  const {mutate: getLogout} = authApi.GetLogout();
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        try {
          const result = await AsyncStorage.getItem('user');
          console.log('result>>', result);
          if (result) {
            setUser(JSON.parse(result));
          }
        } catch (error) {
          console.log('error>>', error);
        }
      };
      getUser();
    }, []),
  );

  const handleConfirmLogout = async () => {
    getLogout(undefined, {
      onSuccess: async res => {
        console.log('>>', res);

        if (res) {
          navigation.navigate(RouteNames.MAIN);
        }
      },
      onError: error => {
        Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
      },
    });
  };

  const handleConfirmDelete = async () => {
    const token = await AsyncStorage.getItem(COOKIE_ACCESS_TOKEN);
    if (token) {
      deleteUser(token, {
        onSuccess: res => {
          navigation.navigate(RouteNames.MAIN);
        },
        onError: error => {
          Alert.alert('오류', '계정 탈퇴 중 오류가 발생했습니다.');
        },
      });
    }
  };

  const handlerEvent = (item: string) => {
    switch (item) {
      case '개인정보 처리방침':
        navigation.navigate(RouteNames.WEBVIEW, {
          url: 'https://modusafe.site/Information',
          title: '개인정보 처리방침',
        });
        break;
      case '약관 및 정책':
        navigation.navigate(RouteNames.WEBVIEW, {
          url: 'https://modusafe.site/Teams',
          title: '약관 및 정책',
        });
        break;
      case '내 게시글':
        navigation.navigate(RouteNames.MyBoard);
        break;
      // case '게저장한 시글':
      //   console.log('게저장한 시글');
      //   break;
      case '로그아웃':
        setModalContent({
          title: '현재 계정에서 로그아웃하시겠습니까?',
          onConfirm: handleConfirmLogout,
        });
        setModalVisible(true);
        break;
      case '탈퇴하기':
        setModalContent({
          title:
            '정말로 계정을 탈퇴하시겠습니까?\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.\n탈퇴 후 다시 회원가입은 7일 후에만 가능합니다.',
          onConfirm: handleConfirmDelete,
        });
        setModalVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.rectangleView}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => navigation.navigate(RouteNames.PROFILE)}>
            <Text style={styles.text}>{user?.nickname} 님</Text>
            <Text style={styles.profileText}>프로필 수정 &gt; </Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            <Person />
          </View>
        </View>
        <View style={{height: 10, backgroundColor: '#f2f2f2'}} />
        <View style={styles.contantView}>
          {myTab.map((item: string, index: number) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.contantBar}
                onPress={() => handlerEvent(item)}>
                <Text style={styles.contantText}>{item}</Text>
                <RightIcon />
              </TouchableOpacity>
              <View style={styles.lineView} />
            </View>
          ))}
        </View>
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={modalContent.title}
          type={'confirm'}
          onConfirm={modalContent.onConfirm}
        />
      </ScrollView>
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
  },
  rectangleView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 26,
    marginBottom: 2,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
  },
  profileText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#aaa',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  PersonIcon: {
    width: 68,
    height: 68,
  },
  contantView: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
  },
  contantBar: {
    height: 113,
    flex: 1,
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  contantText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
  },
  lineView: {
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderTopWidth: 1,
    flex: 1,
    width: '100%',
    marginHorizontal: 20,
    height: 1,
  },
});

export default MyPageScreens;
