import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import React from 'react';
import TitleBar from '@components/TitleBar';
import Person from '@assets/icons/Person.png';

const ProfileScreens = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TitleBar icon={'CloseIcon'} />
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerRight}>완료</Text>
          </View>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>프로필 수정</Text>
        </View>
      </View>
      <View style={{height: 10, backgroundColor: '#f2f2f2'}} />
      <View style={{marginHorizontal: 20}}>
        <Image source={Person} style={styles.PersonIcon} resizeMode="contain" />
        <View style={{marginBottom: 30}}>
          <Text style={styles.labelText}>닉네임</Text>
          <View style={styles.btnContainer}>
            <TextInput style={styles.labelInput} />
            <TouchableHighlight style={styles.labelBtn}>
              <Text style={styles.btnText}>중복 체크</Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.errorText}>중복된 닉네임 입니다!</Text>
        </View>
        <View style={{marginBottom: 30}}>
          <Text style={styles.labelText}>이메일</Text>
          <View style={styles.btnContainer}>
            <TextInput style={styles.labelInput} />
            <TouchableHighlight style={styles.labelBtn}>
              <Text style={styles.btnText}>인증</Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.errorText}>이메일을 입력해주세요!</Text>
        </View>
        <View style={{marginBottom: 30}}>
          <Text style={styles.labelText}>전화번호</Text>
          <View style={styles.btnContainer}>
            <TextInput style={styles.labelInput} />
            <TouchableHighlight style={styles.labelBtn}>
              <Text style={styles.btnText}>인증</Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.errorText}>전화번호를 입력해주세요!</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 120,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    fontSize: 18,
    marginTop: 19,
    fontWeight: '700',
    position: 'absolute',
    right: 21,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
    flex: 1,
    marginTop: 60,
  },
  PersonIcon: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 21,
  },
  labelText: {
    fontSize: 13,
    fontWeight: Platform.OS === 'ios' ? '700' : '900',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
  },
  btnContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 5,
    marginTop: 15,
    marginBottom: Platform.OS === 'ios' ? 5 : -2,
  },
  labelInput: {
    borderRadius: 5,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    width: '70%',
    height: 40,
    paddingLeft: 15,
    paddingVertical: 9,
  },
  labelBtn: {
    borderRadius: 5,
    backgroundColor: '#ccc',
    flex: 1,
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#ff8d8d',
  },
});

export default ProfileScreens;
