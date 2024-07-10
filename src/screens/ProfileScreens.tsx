import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TitleBar from '@components/TitleBar';
import ProfileIcon from '@assets/icons/Profile.png';
import {authApi} from '@api/authApi';
import {UserProfile} from 'types/auth';
import CustomModal from '@components/CustomModal';

const ProfileScreens = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    nickname: '',
    mobile: '',
    email: '',
  });

  const [error, setError] = useState({
    nickname: '',
    mobile: '',
    email: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    onConfirm: () => void;
  }>({
    title: '',
    onConfirm: () => {},
  });

  const [isCheck, setIsCheck] = useState(false);
  const {data: UserData, refetch} = authApi.GetProfile();

  const {mutate: PutProfileMutate} = authApi.PutProfile();

  const {mutate: GetCheckNicknameMutate} = authApi.GetCheckNickname();

  useEffect(() => {
    if (UserData)
      setProfile({
        name: UserData?.name,
        nickname: UserData?.nickname,
        mobile: UserData?.mobile,
        email: UserData?.email,
      });
  }, [UserData]);

  const handlerSubmit = () => {
    let isValid = true;
    let newError = {
      nickname: '',
      mobile: '',
      email: '',
    };

    if (!profile.nickname) {
      newError.nickname = '닉네임을 입력해주세요!';
      isValid = false;
    }

    if (!profile.email) {
      newError.email = '이메일을 입력해주세요!';
      isValid = false;
    }

    if (!profile.mobile) {
      newError.mobile = '전화번호를 입력해주세요!';
      isValid = false;
    }

    setError(newError);

    if (!isCheck) {
      setModalContent({
        title: '중복 체크를 완료해주세요.',
        onConfirm: () => setModalVisible(false),
      });
      setModalVisible(true);
      return;
    }

    if (
      profile.nickname === UserData?.nickname &&
      profile.email === UserData?.email &&
      profile.mobile === UserData?.mobile
    ) {
      setModalContent({
        title: '변경된 사항이 없습니다.',
        onConfirm: () => setModalVisible(false),
      });
      setModalVisible(true);
      return;
    }

    if (isValid) {
      PutProfileMutate(profile, {
        onSuccess: () => {
          setModalContent({
            title: '프로필이 수정되었습니다.',
            onConfirm: () => {
              setModalVisible(false);
              refetch();
            },
          });
          setModalVisible(true);
        },
        onError: () => {
          setModalContent({
            title: '프로필 수정 중 오류가 발생했습니다.',
            onConfirm: () => {
              setModalVisible(false);
            },
          });
          setModalVisible(true);
        },
      });
    }
  };

  const handlerCheck = (type: string) => {
    if (type === 'nickname' && profile.nickname === '') {
      setError({
        ...error,
        nickname: '닉네임을 입력해주세요!',
      });
      return;
    }
    switch (type) {
      case 'nickname':
        GetCheckNicknameMutate(profile.nickname, {
          onSuccess: (data: boolean) => {
            if (data) {
              setError({
                ...error,
                nickname: '사용 가능한 닉네임입니다!',
              });
              setIsCheck(true);
            } else {
              setError({
                ...error,
                nickname: '중복된 닉네임입니다!',
              });
              setIsCheck(false);
            }
          },
          onError: () => {
            setError({
              ...error,
              nickname: '중복된 닉네임입니다!',
            });
            setIsCheck(false);
          },
        });
        break;
      case 'mobile':
        break;
      case 'email':
        break;
    }
  };

  const onChangeText = (key: string, value: string) => {
    setProfile({...profile, [key]: value});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TitleBar icon={'CloseIcon'} />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => handlerSubmit()}>
            <Text style={styles.headerRight}>완료</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>프로필 수정</Text>
        </View>
      </View>
      <View style={{height: 10, backgroundColor: '#f2f2f2'}} />
      <View style={{marginHorizontal: 20}}>
        <Image
          source={ProfileIcon}
          style={styles.PersonIcon}
          resizeMode="contain"
        />
        <View style={{marginBottom: 30}}>
          <Text style={styles.labelText}>닉네임</Text>
          <View style={styles.btnContainer}>
            <TextInput
              style={styles.labelInput}
              placeholder="닉네임을 입력해주세요."
              value={profile.nickname}
              onChangeText={text => onChangeText('nickname', text)}
            />
            <TouchableHighlight
              style={styles.labelBtn}
              onPress={() => handlerCheck('nickname')}>
              <Text style={styles.btnText}>중복 체크</Text>
            </TouchableHighlight>
          </View>
          {error.nickname && (
            <Text
              style={[
                styles.errorText,
                {
                  color:
                    error.nickname === '사용 가능한 닉네임입니다!'
                      ? 'blue'
                      : 'red',
                },
              ]}>
              {error.nickname}
            </Text>
          )}
        </View>
        <View style={{marginBottom: 30}}>
          <Text style={styles.labelText}>이메일</Text>
          <View style={styles.btnContainer}>
            <TextInput
              style={styles.labelInput}
              placeholder="이메일을 입력해주세요."
              readOnly
              value={profile.email}
              onChangeText={text => onChangeText('email', text)}
            />
            <TouchableHighlight
              disabled
              style={styles.labelBtn}
              onPress={() => handlerCheck('email')}>
              <Text style={styles.btnText}>인증</Text>
            </TouchableHighlight>
          </View>
          {error.email && <Text style={styles.errorText}>{error.email}</Text>}
        </View>
        <View style={{marginBottom: 30}}>
          <Text style={styles.labelText}>전화번호</Text>
          <View style={styles.btnContainer}>
            <TextInput
              style={styles.labelInput}
              placeholder="전화번호를 입력해주세요."
              readOnly
              value={profile.mobile}
              onChangeText={text => onChangeText('mobile', text)}
            />
            <TouchableHighlight
              style={styles.labelBtn}
              disabled
              onPress={() => handlerCheck('mobile')}>
              <Text style={styles.btnText}>인증</Text>
            </TouchableHighlight>
          </View>
          {error.mobile && <Text style={styles.errorText}>{error.mobile}</Text>}
        </View>
      </View>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        onConfirm={modalContent.onConfirm}
      />
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
    fontFamily: 'NotoSansCJKkr-Bold',
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
  },
});

export default ProfileScreens;
