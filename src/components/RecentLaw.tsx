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
import NodataIcon from '@assets/icons/NoData.png';

const RecentLaw = () => {
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
  return (
    <>
      {true ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.LowCardContainer}>
          {suggestions.map((suggestio: any, index: number) => (
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
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={NodataIcon}
            style={{height: 32, width: 32, marginBottom: 10}}></Image>
          <Text style={styles.noDataText}>최근 조회한 이력이 없습니다.</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
  noDataText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
    color: '#ccc',
    marginBottom: 35,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});

export default RecentLaw;
