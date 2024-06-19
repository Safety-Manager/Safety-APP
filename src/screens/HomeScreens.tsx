import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
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
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import SearchImg from '@assets/images/Ho.webp';
import ToggleIcon from '@assets/icons/Toggle.png';
import SearchIcon from '@assets/icons/Search.png';
import SearchRefresh from '@assets/icons/SearchRefresh.png';
import LawIcon from '@assets/icons/LatestLaw.png';
import RecentLaw from '@components/RecentLaw';
import LancIcon from '@assets/icons/Lank.png';
import WhiteToggle from '@assets/icons/WhiteToggle.png';
import UpIcon from '@assets/icons/Up.png';
import DownIcon from '@assets/icons/Down.png';
import BottomSheet from '@components/BottomSheet';
import {lawApi} from '@api/lawApi';
import axiosInstance from '@utils/axiosInterceptor';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import _ from 'lodash';

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

const LankData = ['지게차', '비계', '차', '관로', '관'];

type HomeScreenProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreens = ({navigation}: {navigation: HomeScreenProps}) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [searchCategory, setSearchCategory] = useState(null as null | string);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleBottomSheet = () => {
    if (searchCategory) {
      setSearchCategory(null);
    } else {
      setBottomSheetVisible(!bottomSheetVisible);
      Animated.timing(rotateAnim, {
        toValue: bottomSheetVisible ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const fetchData = async (query: string, category: number) => {
    setLoading(true); // 로딩 시작
    try {
      const response = await axiosInstance.get(
        `/law/search?pageNum=${1}&keyWord=${query}&row=10&category=${category}`,
      );
      console.log('response>>', response);
      if (response.data.searchDataList.length > 0) {
        navigation.navigate('Search', {
          searchQuery: query,
          searchData: response.data.searchDataList,
        });
      } else {
        Alert.alert('검색 결과', '검색 결과가 없습니다.', [{text: '확인'}]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('에러', '데이터를 가져오는 도중 문제가 발생했습니다.', [
        {text: '확인'},
      ]);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const debouncedFetchData = useCallback(_.debounce(fetchData, 500), []);

  const onClickSearch = () => {
    if (searchQuery === '') {
      Alert.alert('검색 에러', '검색어를 입력해주세요', [{text: '확인'}]);
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
      {loading && (
        <View style={styles.loadingContainer}>
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>로딩중...</Text>
          </View>
        </View>
      )}
      <ImageBackground
        style={styles.rectangleImage}
        resizeMode="cover"
        source={SearchImg}
        imageStyle={styles.image} // imageStyle을 사용하여 opacity 적용
      >
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
              <Text style={styles.text}>
                {searchCategory ? '초기화' : '카테고리'}
              </Text>

              {searchCategory ? (
                <View style={{width: 11, height: 11}}>
                  <Animated.Image
                    source={SearchRefresh}
                    style={[
                      styles.toggleicon,
                      {transform: [{rotate: rotation}]},
                    ]}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={{width: 9, height: 9}}>
                  <Animated.Image
                    source={ToggleIcon}
                    style={[
                      styles.toggleicon,
                      {transform: [{rotate: rotation}]},
                    ]}
                    resizeMode="contain"
                  />
                </View>
              )}
            </Pressable>
            {searchCategory && (
              <Pressable style={styles.selectRectangleView}>
                <Text style={styles.selectText}>{searchCategory}</Text>
                <View style={{width: 9, height: 9}}>
                  <Animated.Image
                    source={WhiteToggle}
                    style={[styles.toggleicon]}
                    resizeMode="contain"
                  />
                </View>
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
                onSubmitEditing={onClickSearch}
              />
              <Pressable
                style={styles.searchButton}
                onPress={() => onClickSearch()}>
                <Image
                  source={SearchIcon}
                  style={styles.searchicon}
                  resizeMode="contain"
                />
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
        <Image source={LawIcon} style={styles.LowIcons} resizeMode="contain" />
        <Text style={styles.LowText}>최근 조회한 이력</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.LowCardContainer}>
        <RecentLaw data={suggestions} />
      </ScrollView>

      <View style={styles.lank}>
        <Image source={LancIcon} style={styles.LowIcons} resizeMode="contain" />
        <Text style={styles.LowText}>검색어 순위</Text>
      </View>
      {LankData.map((data, index) => (
        <View style={styles.lancContainer} key={index}>
          <Text style={styles.lankTitle}>{index + 1}</Text>
          <Text style={styles.lankText}>{data}</Text>
          <Image source={UpIcon} style={styles.lankIcon} resizeMode="contain" />
        </View>
      ))}
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
    backgroundColor: '#000',
  },
  image: {
    opacity: 0.6,
  },
  contentContainer: {
    // position: 'absolute',
    // top: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? '20%' : '10%',
    height: 250,
    left: 20,
  },
  imagetext: {
    fontWeight: '800',
    fontFamily: 'NanumGothic',
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
    width: '50%',
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
  LowIcons: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  LowText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
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
    marginBottom: 12,
  },
  lancContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 20,
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
    height: 11,
    width: 11,
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
