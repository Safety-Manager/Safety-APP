import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import TitleBar from '@components/TitleBar';
import PersonIcon from '@assets/icons/Person.png';
import SendIcon from '@assets/icons/Send.png';

const WriteScreens = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      nickname: '상구',
      date: '2023-04-13',
      content: 'Seeking for a data science intern to join our team.',
      replies: [],
    },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <TitleBar />
            <Text style={styles.headerTitle}>게시글 작성</Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>제목</Text>
            <TextInput
              style={styles.postTitle}
              placeholder="제목을 입력해주세요."
            />
            <Text style={styles.title}>내용</Text>
            <TextInput
              style={styles.postContent}
              placeholder="내용을 입력해주세요."
              multiline={true}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>게시글 제출</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    marginTop: 11,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#121417',
  },
  postBtn: {
    marginTop: 11,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#637587',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#121417',
    marginTop: 10,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    backgroundColor: '#f0f2f5',
    width: '100%',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  postContent: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    borderRadius: 12,
    backgroundColor: '#f0f2f5',
    width: '100%',
    height: '75%',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  imagePicker: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#637587',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: '#637587',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default WriteScreens;
