import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import Person from '@assets/icons/Person.png';
import RightLine from '@assets/icons/RightLine.png';

const myTab = [
  '개인정보 처리방침',
  '약관 및 정책',
  '문의하기',
  '로그아웃',
  '탈퇴하기',
];

const MyPageScreens = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.rectangleView}>
          <TouchableOpacity style={styles.textContainer}>
            <Text style={styles.text}>김민지 님</Text>
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
          {myTab.map((item: string, index: number) => {
            return (
              <View key={index}>
                <TouchableOpacity style={styles.contantBar}>
                  <Text style={styles.contantText}>{item}</Text>
                  <Image
                    source={RightLine}
                    style={{width: 20, height: 17}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View style={styles.lineView} />
              </View>
            );
          })}
        </View>
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
