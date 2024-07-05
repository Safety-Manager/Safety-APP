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
      <View style={styles.header}>
        <TitleBar icon={'CloseIcon'} />
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerRight}>완료</Text>
          </View>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>게시글 작성</Text>
        </View>
      </View>
      <View style={{height: 10, backgroundColor: '#f2f2f2'}} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Text style={styles.title}>제목</Text>
            <TextInput
              style={styles.postTitle}
              placeholder="제목을 입력해주세요."
              placeholderTextColor="#6b6b6b"
            />
            <Text style={styles.title}>내용</Text>
            <TextInput
              style={styles.postContent}
              placeholder="내용을 입력해주세요."
              multiline={true}
              placeholderTextColor="#6b6b6b"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    width: '100%',
    height: Platform.OS === 'ios' ? 100 : 120,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    marginTop: Platform.OS === 'ios' ? 60 : 60,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    backgroundColor: '#ededed',
    width: '100%',
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  postContent: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    borderRadius: 5,
    backgroundColor: '#ededed',
    width: '100%',
    height: '75%',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});

export default WriteScreens;
