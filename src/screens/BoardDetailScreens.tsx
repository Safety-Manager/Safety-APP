import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  Pressable,
  TextInput,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import WriteIcon from '@assets/icons/Write.png';
import CommentIcon from '@assets/icons/Comments.png';
import Person from '@assets/icons/Person.png';
import TitleBar from '@components/TitleBar';
import PersonIcon from '@assets/icons/Person.png';
import SearchIcon from '@assets/icons/Search.png';
import SendIcon from '@assets/icons/Send.png';

const BoardDetailScreens = () => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      nickname: '상구',
      date: '2023-04-13',
      content: 'Seeking for a data science intern to join our team.',
      replies: [],
    },
  ]);
  const [replyText, setReplyText] = useState('');
  const [newCommentText, setNewCommentText] = useState(''); // New state for the main comment text

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardOffset(event.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOffset(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleReplyPress = (commentId: any) => {
    setReplyCommentId(replyCommentId === commentId ? null : commentId);
  };

  const handleReplySubmit = () => {
    if (replyText.trim() !== '') {
      setComments(prevComments =>
        prevComments.map((comment: any) =>
          comment.id === replyCommentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: comment.replies.length + 1,
                    nickname: 'User', // Replace with the actual user's nickname
                    date: new Date().toISOString().split('T')[0],
                    content: replyText,
                  },
                ],
              }
            : comment,
        ),
      );
      setReplyText('');
      setReplyCommentId(null);
    }
  };

  const handleNewCommentSubmit = () => {
    if (newCommentText.trim() !== '') {
      setComments(prevComments => [
        ...prevComments,
        {
          id: prevComments.length + 1,
          nickname: 'User', // Replace with the actual user's nickname
          date: new Date().toISOString().split('T')[0],
          content: newCommentText,
          replies: [],
        },
      ]);
      setNewCommentText('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={{
          width: '100%',
          height: 50,
        }}>
        <TitleBar />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>
            산업 안전 보건령에 대한 질문이 있습니다.
          </Text>
          <Text style={styles.content}>
            Seeking for a data science intern to josdsdin our tedsddsam.
          </Text>
          <View style={styles.headerRow}>
            <Image
              source={PersonIcon}
              style={styles.personIcon}
              resizeMode="contain"
            />
            <View style={styles.headerColumn}>
              <Text style={styles.nickName}>상구</Text>
              <Text style={styles.date}>2023-04-13</Text>
            </View>
            <Image
              source={CommentIcon}
              style={styles.commentIcon}
              resizeMode="contain"
            />
            <Text style={styles.commentCount}>{comments.length}</Text>
          </View>
          <Text style={styles.comment}>답글</Text>
          <View style={styles.commentSection}>
            {comments.map(comment => (
              <View key={comment.id}>
                <View style={styles.commentRow}>
                  <Image
                    source={PersonIcon}
                    style={styles.commentPersonIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.commentColumn}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.commentNickName}>
                        {comment.nickname}
                      </Text>
                      <Text style={styles.commentDate}>{comment.date}</Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => handleReplyPress(comment.id)}>
                    <Text style={styles.replyButtonText}>답글</Text>
                  </TouchableOpacity>
                </View>

                {comment.replies.map((reply: any) => (
                  <View key={reply.id} style={{marginLeft: 56, marginTop: 10}}>
                    <View style={styles.commentRow}>
                      <Image
                        source={PersonIcon}
                        style={styles.commentPersonIcon}
                        resizeMode="contain"
                      />
                      <View style={styles.commentColumn}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.commentNickName}>
                            {reply.nickname}
                          </Text>
                          <Text style={styles.commentDate}>{reply.date}</Text>
                        </View>
                        <Text style={styles.commentContent}>
                          {reply.content}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                {replyCommentId === comment.id && (
                  <View style={styles.replyForm}>
                    <Image
                      source={PersonIcon}
                      style={styles.replyPersonIcon}
                      resizeMode="contain"
                    />
                    <View style={styles.searchbarContainer}>
                      <TextInput
                        style={styles.searchbarView}
                        placeholderTextColor="black"
                        placeholder="답글을 입력해주세요."
                        value={replyText}
                        onChangeText={setReplyText}
                      />
                      <Pressable
                        style={styles.searchButton}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        onPress={handleReplySubmit}>
                        <Image
                          source={SendIcon}
                          style={styles.searchicon}
                          resizeMode="contain"
                        />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomReply}>
        <View style={styles.keyboardAvoidingView}>
          <Image
            source={PersonIcon}
            style={styles.replyPersonIcon}
            resizeMode="contain"
          />
          <View style={styles.searchbarContainer}>
            <TextInput
              style={styles.searchbarView}
              placeholderTextColor="black"
              placeholder="댓글을 입력해주세요."
              value={newCommentText}
              onChangeText={setNewCommentText}
            />
            <Pressable
              style={styles.searchButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              onPress={handleNewCommentSubmit}>
              <Image
                source={SendIcon}
                style={styles.searchicon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80, // 하단의 댓글 입력 폼에 공간을 확보하기 위한 여백
  },
  cardContent: {
    marginHorizontal: 10,
    padding: 15,
    gap: 20,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#6b6b6b',
  },
  headerRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  personIcon: {
    width: 56,
    height: 56,
    marginRight: 10,
    borderRadius: 28,
  },
  headerColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  nickName: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#121417',
  },
  date: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#637587',
  },
  commentIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  commentCount: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
    marginLeft: 5,
  },
  comment: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#121417',
    marginTop: 60,
  },
  commentSection: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  commentPersonIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  commentColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  commentNickName: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#121417',
    marginRight: 12,
  },
  commentDate: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#637587',
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#121417',
  },
  bottomReply: {
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 60 : 70,
  },
  keyboardAvoidingView: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 10,
    left: 0,
    right: 0,
    padding: 10,
  },
  replyPersonIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  searchbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ededed',
    borderRadius: 25,
    paddingLeft: 10,
  },
  searchbarView: {
    flex: 1,
    height: 40,
  },
  searchButton: {
    padding: 10,
  },
  searchicon: {
    width: 20,
    height: 20,
  },
  replyButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  replyForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 56,
    marginBottom: 20,
  },
});

export default BoardDetailScreens;
