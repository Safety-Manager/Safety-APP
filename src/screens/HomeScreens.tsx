import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Keyboard,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import HomeImg from '@assets/images/Home.jpeg';
import ToggleIcon from '@assets/icons/Toggle.png';
import SearchIcon from '@assets/icons/Search.svg';
import RecentLaw from '@components/RecentLaw';
import UpIcon from '@assets/icons/Up.svg';
import BottomSheet from '@components/BottomSheet';
import {lawApi} from '@api/lawApi';
import axiosInstance from '@utils/axiosInterceptor';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import _ from 'lodash';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList, RouteNames} from '@components/Route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '@api/authApi';
import messaging from '@react-native-firebase/messaging';
import {FCM_TOKEN} from '../config/constants';
import CustomModal from '@components/CustomModal';
import LawIcon from '@assets/icons/LawIcon.svg';
import LankIcon from '@assets/icons/LankIcon.svg';
const suggestions = [
  '지게차',
  '비계',
  '질식',
  '관로',
  '나무',
  '폐기물',
  '수거',
  '화학설비',
];

type HomeScreenProps = NativeStackNavigationProp<RootStackParamList>;

const HomeScreens = ({navigation}: {navigation: HomeScreenProps}) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [searchCategory, setSearchCategory] = useState('전체' as null | string);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    onConfirm: () => void;
  }>({
    title: '',
    onConfirm: () => {},
  });

  const {data: HistoryData, refetch} = lawApi.GetLawHistory();
  const {data: LankingData, refetch: lankRetetch} = lawApi.GetLawLanking();

  const {data: UserData} = authApi.GetProfile();

  const {mutate} = authApi.PutAgreeNotification();

  async function requestUserPermission() {
    const StoregeLank = await AsyncStorage.getItem('lawLanking');

    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getToken();
      } else {
        console.log('Notification permission not granted');
      }
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: '알림 권한 요청',
          message: '이 앱은 알림을 보내기 위해 알림 권한이 필요합니다.',
          buttonNeutral: '나중에 묻기',
          buttonNegative: '취소',
          buttonPositive: '확인',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
        getToken();
      } else {
        console.log('Notification permission not granted');
      }
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      const fcmToken = await AsyncStorage.getItem('FCM_TOKEN');
      if (token && fcmToken === null) {
        mutate(
          {
            fcmDeviceToken: token,
            notificationType: ['QNA_NOTIFICATION'],
          },
          {
            onSuccess: async () => {
              await AsyncStorage.setItem('FCM_TOKEN', JSON.stringify(token));
            },
            onError: error => {
              console.error('Error agreeing notification:', error);
            },
          },
        );
      } else {
        console.log('Failed to get FCM token');
      }
    } catch (error) {
      console.error('Error fetching FCM token:', error);
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    if (UserData) AsyncStorage.setItem('user', JSON.stringify(UserData));
  }, [UserData]);

  useFocusEffect(
    useCallback(() => {
      refetch(); // 페이지가 포커스될 때마다 refetch 함수 호출
      const backAction = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [refetch]),
  );

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleBottomSheet = () => {
    setBottomSheetVisible(!bottomSheetVisible);
    Animated.timing(rotateAnim, {
      toValue: bottomSheetVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // 호출 부분
  const fetchData = async (query: string, category: number) => {
    try {
      const response = await axiosInstance.get(
        `/law/search?pageNum=${1}&keyWord=${query}&row=1&category=${category}`,
      );
      if (response.data.searchDataList.length > 0) {
        navigation.navigate(RouteNames.SEARCH, {
          searchQuery: query,
          category: category,
          searchData: response.data.searchDataList,
        });
      } else {
        setModalVisible(true);
        setModalContent({
          title: '검색 결과가 없습니다.',
          onConfirm: () => setModalVisible(false),
        });
      }
    } catch (error) {
      console.error(error);
      // Alert.alert('에러', '데이터를 가져오는 도중 문제가 발생했습니다.', [
      //   {text: '확인'},
      // ]);
    }
  };

  // 검색어 입력 시 0.5초 후에 fetchData 함수 호출
  const debouncedFetchData = useCallback(_.debounce(fetchData, 500), []);

  // 검색 버튼 클릭 시
  const onClickSearch = () => {
    if (searchQuery === '') {
      setModalVisible(true);
      setModalContent({
        title: '검색어를 입력 해 주세요.',
        onConfirm: () => setModalVisible(false),
      });
    } else {
      let category = 0;
      switch (searchCategory) {
        case '전체':
          category = 0;
          break;
        case '산업안전보건법':
          category = 1;
          break;
        case '산업안전보건법 시행령':
          category = 2;
          break;
        case '산업안전보건법 시행규칙':
          category = 3;
          break;
        case '산업안전보건법 기준에 관한 규칙':
          category = 4;
          break;
        case '고시 · 훈령 · 예규':
          category = 5;
          break;
        case 'KOSHA GUIDE':
          category = 7;
          break;
        default:
          category = 0;
          break;
      }
      debouncedFetchData(searchQuery, category);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={styles.rectangleImage}
        resizeMode="cover"
        source={HomeImg}>
        <View style={styles.contentContainer}>
          <Text style={styles.imagetext}>
            산업 안전 관리자를 위한{'\n'}
            법률 정보를{'\n'}
            손쉽게 찾아 보세요.
          </Text>
        </View>
        <View style={{flex: 1, width: '100%'}}>
          <View style={{flexDirection: 'row'}}>
            <Pressable style={styles.rectangleView} onPress={toggleBottomSheet}>
              <Text style={styles.text}>카테고리</Text>
              <View style={{width: 9, height: 9}}>
                <Animated.Image
                  source={ToggleIcon}
                  style={[styles.toggleicon, {transform: [{rotate: rotation}]}]}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
            {searchCategory && (
              <Pressable style={styles.selectRectangleView}>
                <Text style={styles.selectText}>{searchCategory}</Text>
              </Pressable>
            )}
          </View>
          <BottomSheet
            visible={bottomSheetVisible}
            searchCategory={searchCategory}
            setSearchCategory={setSearchCategory}
            onClose={() => {
              setBottomSheetVisible(false);
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start();
            }}
          />
          <View style={{width: '100%'}}>
            <View style={styles.searchbarContainer}>
              <TextInput
                style={styles.searchbarView}
                placeholderTextColor="#ccc"
                placeholder="검색어를 입력해주세요."
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                onSubmitEditing={onClickSearch} // 키보드의 검색 버튼을 눌렀을 때 호출
              />
              <Pressable
                style={styles.searchButton}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPressIn={onClickSearch} // 검색 버튼을 눌렀을 때 호출
              >
                <SearchIcon />
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionContainer}>
              <Text style={styles.bestText}>추천 검색어</Text>
              {suggestions.map((suggestion: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => setSearchQuery(suggestion)}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.LowContainer}>
        <LawIcon />
        <Text style={styles.LowText}>최근 조회한 이력</Text>
      </View>
      {HistoryData && HistoryData.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.LowCardContainer}>
          <RecentLaw data={HistoryData} />
        </ScrollView>
      ) : (
        <RecentLaw data={HistoryData} />
      )}

      <View style={styles.lank}>
        <LankIcon />
        <Text style={styles.LowText}>검색어 순위</Text>
      </View>
      {LankingData?.map((data, index) => (
        <View style={styles.lancContainer} key={index}>
          <Text style={styles.lankTitle}>{index + 1}</Text>
          <TouchableOpacity onPress={() => setSearchQuery(data.keyword)}>
            <Text style={styles.lankText}>{data.keyword}</Text>
          </TouchableOpacity>
          <UpIcon style={styles.lankIcon} />
        </View>
      ))}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        onConfirm={modalContent.onConfirm}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  rectangleImage: {
    width: '100%',
    height: 500,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? '20%' : '10%',
    height: 250,
    left: 20,
  },
  imagetext: {
    fontWeight: '800',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#fff',
    textAlign: 'left',
    fontSize: 25,
    marginBottom: 10,
  },
  rectangleView: {
    borderRadius: 50,
    backgroundColor: '#fff',
    width: '30%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 20,
    marginTop: 90,
    marginBottom: 10,
  },
  selectRectangleView: {
    borderRadius: 50,
    backgroundColor: '#404d60',
    width: '55%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginLeft: 10,
    marginTop: 90,
    marginBottom: 10,
  },
  selectText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 5,
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#ffff',
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 5,
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#000',
  },
  toggleicon: {
    width: '100%',
    height: '100%',
  },
  searchbarContainer: {
    position: 'relative',
    width: '90%',
    marginBottom: 20,
  },
  searchbarView: {
    borderRadius: 80,
    backgroundColor: '#fff',
    height: 50,
    marginLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    paddingLeft: 15,
  },
  searchButton: {
    position: 'absolute',
    right: 1,
    top: 15,
  },
  searchicon: {
    width: 20,
    height: 20,
  },
  bestText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#fff',
    marginLeft: 20,
    marginRight: 10,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionItem: {
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    flex: 1,
    width: 60,
    height: 28,
    justifyContent: 'center',
    marginRight: 5,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#fff',
    textAlign: 'center',
  },
  LowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 10,
  },
  LowText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
    marginLeft: 5,
  },
  LowCardContainer: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  lank: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 20,
    marginBottom: Platform.OS === 'ios' ? 10 : 4,
  },
  lancContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 5,
    width: '100%',
  },
  lankTitle: {
    fontSize: 15,
    marginRight: 10,
    fontFamily: 'NotoSansCJKkr-Medium',
    fontWeight: '800',
    color: '#000',
  },
  lankText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#000',
  },
  lankIcon: {
    position: 'absolute',
    marginRight: 20,
    right: 20,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreens;
