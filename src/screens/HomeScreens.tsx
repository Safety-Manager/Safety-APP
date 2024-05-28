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
} from 'react-native';
import React from 'react';
import SearchImg from '@assets/images/SearchImg.png';
import ToggleIcon from '@assets/icons/Toggle.png';
import SearchIcon from '@assets/icons/Search.png';
import LawIcon from '@assets/icons/LatestLaw.png';

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

const HomeScreens = ({navigation}: {navigation: any}) => {
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
            <View style={styles.rectangleView}>
              <Text style={styles.text}>카테고리</Text>
              <View style={{width: 9, height: 9}}>
                <Image
                  source={ToggleIcon}
                  style={styles.toggleicon}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={{width: '100%'}}>
              <View style={styles.searchbarContainer}>
                <TextInput
                  style={styles.searchbarView}
                  placeholderTextColor="#ccc"
                  placeholder="검색어를 입력해주세요."
                />
                <Image source={SearchIcon} style={styles.searchicon} />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionContainer}>
                <Text style={styles.bestText}>추천 검색어</Text>
                {suggestions.map((suggestion, index) => (
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
        <Image source={LawIcon} style={styles.LowIcons} />
        <Text style={styles.LowText}>최근 조회한 이력</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.LowCardContainer}>
        {suggestions.map((suggestion, index) => (
          <View key={index} style={styles.LowCard}>
            <View style={{marginLeft: 20}}>
              <Text style={styles.LowCardTittle}>제목</Text>
              <Text
                style={styles.LowCardTittleInfo}
                numberOfLines={2}
                ellipsizeMode="tail">
                (특수형태근로종사자) {'\n'}굴착기 운전자 안전보건교육
                (특수형태근로종사자) {'\n'}굴착기 운전자 안전보건교육
                (특수형태근로종사자) {'\n'}굴착기 운전자 안전보건교육
              </Text>
              <View style={styles.LowLine} />
              <Text style={styles.LowCardTittle}>카테고리</Text>
              <Text
                style={styles.LowCardTittleInfo}
                numberOfLines={1}
                ellipsizeMode="tail">
                산업안전보건 기준에 관한 규칙
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    opacity: 0.65,
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
  LowCardContainer: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  LowCard: {
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    width: 251,
    height: 170,
    marginRight: 10,
    marginBottom: 10,
  },
  LowCardTittle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr',
    color: '#bbb',
    marginTop: 15,
    marginBottom: 4,
  },
  LowCardTittleInfo: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
    color: '#000',
    marginBottom: 12,
    paddingRight: 38,
    textAlign: 'left',
  },
  LowLine: {
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderTopWidth: 1,
    flex: 1,
  },
});

export default HomeScreens;
