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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SearchImg from '@assets/images/SearchImg.png';
import ToggleIcon from '@assets/icons/Toggle.png';
import SearchIcon from '@assets/icons/Search.png';
import LawIcon from '@assets/icons/LatestLaw.png';
import RecentLaw from '@components/RecentLaw';
import LancIcon from '@assets/icons/Lank.png';
import UpIcon from '@assets/icons/Up.png';
import DownIcon from '@assets/icons/Down.png';
import BottomSheet from '@components/BottomSheet';

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
const HomeScreens = ({navigation}: {navigation: any}) => {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

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

  return (
    <ScrollView style={styles.container}>
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
          <View style={{width: '100%', height: 100}}>
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
            <BottomSheet
              visible={bottomSheetVisible}
              searchText={searchText}
              setSearchText={setSearchText}
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
                />
                <Image
                  source={SearchIcon}
                  style={styles.searchicon}
                  resizeMode="contain"
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionContainer}>
                <Text style={styles.bestText}>추천 검색어</Text>
                {suggestions.map((suggestion: any, index: number) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.LowContainer}>
        <Image source={LawIcon} style={styles.LowIcons} resizeMode="contain" />
        <Text style={styles.LowText}>최근 조회한 이력</Text>
      </View>
      <RecentLaw />
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
    flex: 1,
    backgroundColor: '#fff',
  },
  rectangleImage: {
    width: '100%',
    height: 500,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  image: {
    opacity: 0.98,
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
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    marginLeft: 20,
    marginTop: 90,
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
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
  searchicon: {
    position: 'absolute',
    right: 1,
    top: 15,
    width: 20,
    height: 20,
  },
  bestText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr',
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
    fontFamily: 'NotoSansCJKkr',
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
    fontFamily: 'NotoSansCJKkr',
    color: '#000',
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
    fontFamily: 'NotoSansCJKkr',
    fontWeight: '800',
    color: '#000',
  },
  lankText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
    color: '#000',
  },
  lankIcon: {
    height: 11,
    width: 11,
    position: 'absolute',
    marginRight: 20,
    right: 20,
  },
});

export default HomeScreens;
