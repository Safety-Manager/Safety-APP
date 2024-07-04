import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Person from '@assets/icons/Person.png';
import RightLine from '@assets/icons/RightLine.png';
import {authApi} from '@api/authApi';
import {navigate} from '@utils/navigationRef';
import {RootStackParamList, RouteNames} from '@components/Route';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserTypes} from 'types/auth';
import CustomModal from '@components/CustomModal';

const myTab = [
  '개인정보 처리방침',
  '약관 및 정책',
  '문의하기',
  '로그아웃',
  '탈퇴하기',
];

type ScreenProps = NativeStackNavigationProp<RootStackParamList>;

const MyPageScreens = () => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    onConfirm: () => void;
  }>({
    title: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const getUser = async () => {
      const result = await AsyncStorage.getItem('user');
      if (result) {
        setUser(JSON.parse(result));
      }
    };
    getUser();
  }, []);

  const {mutate: deleteUser} = authApi.DeleteUser();

  const navigation: ScreenProps = useNavigation(); // Use the useNavigation hook to access the navigation object

  const handleConfirmLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate(RouteNames.MAIN);
  };

  const handleConfirmDelete = () => {
    deleteUser(undefined, {
      onSuccess: res => {
        navigation.navigate(RouteNames.MAIN);
      },
      onError: error => {
        Alert.alert('오류', '계정 탈퇴 중 오류가 발생했습니다.');
      },
    });
  };

  const handlerEvent = (item: string) => {
    switch (item) {
      case '개인정보 처리방침':
        console.log('개인정보 처리방침');
        break;
      case '약관 및 정책':
        console.log('약관 및 정책');
        break;
      case '문의하기':
        console.log('문의하기');
        break;
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
            '정말로 계정을 탈퇴하시겠습니까?\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.',
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
          <TouchableOpacity style={styles.textContainer}>
            <Text style={styles.text}>{user?.nickname} 님</Text>
            <Text style={styles.profileText}>프로필 수정 &gt; </Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            <Image
              source={Person}
              style={styles.PersonIcon}
              resizeMode="contain"
            />
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
                <Image
                  source={RightLine}
                  style={{width: 20, height: 17}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={styles.lineView} />
            </View>
          ))}
        </View>
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={modalContent.title}
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
