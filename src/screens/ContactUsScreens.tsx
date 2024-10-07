<<<<<<< HEAD
=======
import {authApi} from '@api/authApi';
import CustomModal from '@components/CustomModal';
>>>>>>> 0712815940b5f4b04fa754a3fa0ec619749ed7af
import TitleBar from '@components/TitleBar';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';

<<<<<<< HEAD
export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Handle form submission logic
    console.log('Form submitted', {name, email, message});
=======
export default function ContactUsScreens() {
  const [data, setData] = useState({
    title: '',
    email: '',
    content: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지

  const {mutate: postContactUs} = authApi.PostInquiry();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    // 입력 데이터 검증
    if (!data.title.trim()) {
      setModalMessage('제목을 입력해 주세요');
      setModalVisible(true);
      return;
    }
    if (!data.email.trim()) {
      setModalMessage('이메일을 입력해 주세요');
      setModalVisible(true);
      return;
    }
    if (!validateEmail(data.email.trim())) {
      setModalMessage('유효한 이메일 주소를 입력해 주세요');
      setModalVisible(true);
      return;
    }
    if (!data.content.trim()) {
      setModalMessage('내용을 입력해 주세요');
      setModalVisible(true);
      return;
    }

    // 모든 입력이 유효한 경우 폼 제출
    postContactUs(data, {
      onSuccess: res => {
        setModalMessage('문의가 성공적으로 제출되었습니다.'); // 성공 메시지 설정
        setModalVisible(true);
        setData({title: '', email: '', content: ''}); // 폼 초기화
      },
      onError: error => {
        setModalMessage('문의 제출 중 오류가 발생했습니다.'); // 오류 메시지 설정
        setModalVisible(true);
      },
    });
>>>>>>> 0712815940b5f4b04fa754a3fa0ec619749ed7af
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TitleBar icon={'CloseIcon'} />

        <View style={styles.headerContainer}>
          <View></View>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.headerRight}>완료</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>문의하기</Text>
        </View>
      </View>
      <View style={{height: 10, backgroundColor: '#f2f2f2'}} />
      <View style={{padding: 20, marginTop: 20}}>
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          placeholder="문의 제목을 입력해주세요"
<<<<<<< HEAD
          value={name}
          onChangeText={setName}
=======
          value={data.title}
          onChangeText={e => setData({...data, title: e})}
>>>>>>> 0712815940b5f4b04fa754a3fa0ec619749ed7af
        />
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일을 입력해주세요"
<<<<<<< HEAD
          value={message}
          onChangeText={setMessage}
=======
          value={data.email}
          onChangeText={e => setData({...data, email: e})}
>>>>>>> 0712815940b5f4b04fa754a3fa0ec619749ed7af
          multiline
        />
        <Text style={styles.label}>내용</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="문의 내용을 입력해주세요"
<<<<<<< HEAD
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>
=======
          value={data.content}
          onChangeText={e => setData({...data, content: e})}
          multiline
        />
      </View>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalMessage} // 모달에 표시할 메시지
        onConfirm={() => setModalVisible(false)}
      />
>>>>>>> 0712815940b5f4b04fa754a3fa0ec619749ed7af
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: Platform.OS === 'ios' ? 100 : 120,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 10 : 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  headerRight: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? 15 : 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: Platform.OS === 'ios' ? '700' : '900',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
