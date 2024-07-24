import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import TitleBar from '@components/TitleBar';
import {boardApi} from '@api/boardApi';
import CustomModal from '@components/CustomModal';
import {RootStackParamList, RouteNames} from '@components/Route';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import _ from 'lodash';

type ScreenProps = NativeStackNavigationProp<RootStackParamList>;

const WriteScreens = ({navigation}: {navigation: ScreenProps}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const {mutate} = boardApi.PostBoard();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    onConfirm: () => void;
  }>({
    title: '',
    onConfirm: () => {},
  });

  const handlePostSubmit = useCallback(
    _.debounce(() => {
      if (title !== '' && content !== '') {
        mutate(
          {
            title: title,
            content: content,
          },
          {
            onSuccess(data, variables, context) {
              if (data) {
                setModalContent({
                  title: '게시글이 등록되었습니다.',
                  onConfirm: () => {
                    setModalVisible(false);
                    setTitle('');
                    setContent('');
                  },
                });
                setModalVisible(true);
                navigation.navigate(RouteNames.BOARD);
              }
            },
          },
        );
      } else {
        setModalContent({
          title: '제목, 내용을 입력해주세요.',
          onConfirm: () => {
            setModalVisible(false);
          },
        });
        setModalVisible(true);
      }
    }, 300),
    [title, content, mutate, navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TitleBar icon={'CloseIcon'} />

        <View style={styles.headerContainer}>
          <View></View>
          <TouchableOpacity onPress={() => handlePostSubmit()}>
            <Text style={styles.headerRight}>완료</Text>
          </TouchableOpacity>
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
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.title}>내용</Text>
            <TextInput
              style={styles.postContent}
              placeholder="내용을 입력해주세요."
              multiline={true}
              placeholderTextColor="#6b6b6b"
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    height: Platform.OS === 'ios' ? 100 : 120,
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
    paddingHorizontal: 10,
    paddingVertical: 0, // 추가
    lineHeight: Platform.OS === 'ios' ? 0 : 50, // 추가
    marginBottom: 15,
  },
  postContent: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    borderRadius: 5,
    backgroundColor: '#ededed',
    width: '100%',
    height: '75%',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0, // 추가
    lineHeight: 24, // 추가
  },
});

export default WriteScreens;
