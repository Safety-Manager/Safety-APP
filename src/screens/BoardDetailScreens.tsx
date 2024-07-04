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
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import WriteIcon from '@assets/icons/Write.png';
import CommentIcon from '@assets/icons/Comments.png';
import Person from '@assets/icons/Person.png';
import TitleBar from '@components/TitleBar';
import PersonIcon from '@assets/icons/Person.png';
import SearchIcon from '@assets/icons/Search.png';
import SendIcon from '@assets/icons/Send.png';

const BoardDetailScreens = () => {
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
  const replyInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({animated: true});
        }
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // Do nothing when the keyboard hides
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleReplyPress = commentId => {
    if (replyCommentId === commentId) {
      setReplyCommentId(null);
    } else {
      setReplyCommentId(commentId);
      setTimeout(() => {
        if (replyInputRef.current) {
          replyInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleReplySubmit = () => {
    if (replyText.trim() !== '') {
      setComments(prevComments =>
        prevComments.map(comment =>
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

  const handleDeleteComment = commentId => {
    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.titleBarContainer}>
        <TitleBar />
      </View>
      <View style={styles.divider} />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        ref={scrollViewRef}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>
            산업 안전 보건령에 대한 질문이 있습니다.
          </Text>
          <Text style={styles.content}>
            Seeking for a data science intern to join our team.
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
          <View style={styles.dividerWithMargin} />
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
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentNickName}>
                        {comment.nickname}
                      </Text>
                      <Text style={styles.commentDate}>{comment.date}</Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteComment(comment.id)}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </View>

                {comment.replies.map(reply => (
                  <View key={reply.id} style={styles.replyContainer}>
                    <View style={styles.commentRow}>
                      <Image
                        source={PersonIcon}
                        style={styles.commentPersonIcon}
                        resizeMode="contain"
                      />
                      <View style={styles.commentColumn}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentNickName}>
                            {reply.nickname}
                          </Text>
                          <Text style={styles.commentDate}>{reply.date}</Text>
                        </View>
                        <Text style={styles.commentContent}>
                          {reply.content}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteComment(reply.id)}>
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </TouchableOpacity>
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
                        ref={replyInputRef}
                        onSubmitEditing={handleReplySubmit}
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
                <TouchableOpacity
                  style={styles.replyButton}
                  onPress={() => handleReplyPress(comment.id)}>
                  <Text style={styles.replyButtonText}>
                    {replyCommentId === comment.id ? '취소' : '댓글달기'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {replyCommentId === null && (
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
                onSubmitEditing={handleNewCommentSubmit}
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
      )}
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
    marginTop: 20,
  },
  commentSection: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    bottom: 0,
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
    paddingLeft: 63,
    paddingBottom: 30,
  },
  replyButtonText: {
    color: '#888888', // Light grey color for the reply button
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'transparent', // Transparent background for text
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: '#FF0000', // Red text color for delete button
    fontSize: 14,
    fontWeight: '600',
  },
  replyForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 56,
    marginBottom: 10,
  },
  replyContainer: {
    marginLeft: 56,
    marginTop: 10,
  },
  divider: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
  },
  dividerWithMargin: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    marginTop: 20,
  },
  commentHeader: {
    flexDirection: 'row',
  },
  titleBarContainer: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
  },
});

export default BoardDetailScreens;
