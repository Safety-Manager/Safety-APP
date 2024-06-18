import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
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
    <ScrollView style={styles.container}>
      <View style={styles.rectangleView}>
        <TouchableOpacity style={styles.rectangleContainer}>
          <Text style={styles.text}>김민지 님</Text>
          <Text style={styles.profileText}>프로필 수정 &gt; </Text>
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Image
            source={Person}
            style={styles.PersonIcon}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.contantView}>
        {myTab.map((item: string, index: number) => {
          return (
            <View key={index}>
              <TouchableOpacity style={styles.contantBar}>
                <Text style={styles.contantText}>{item}</Text>
              </TouchableOpacity>
              <View style={styles.lineView} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  rectangleView: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    height: 160,
    justifyContent: 'center',
    paddingLeft: 20,
    flexDirection: 'row',
    marginBottom: 10,
  },
  rectangleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    fontSize: 26,
    marginBottom: 2,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr',
    color: '#000',
  },
  profileText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
    color: '#aaa',
    alignItems: 'flex-end',
  },
  PersonIcon: {
    width: '100%',
    height: 68,
    overflow: 'hidden',
  },
  contantView: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contantBar: {
    height: 113,
    flex: 1,
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  contantText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr',
    color: '#000',
    marginLeft: 20,
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
