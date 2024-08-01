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

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Handle form submission logic
    console.log('Form submitted', {name, email, message});
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
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일을 입력해주세요"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Text style={styles.label}>내용</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="문의 내용을 입력해주세요"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>
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
