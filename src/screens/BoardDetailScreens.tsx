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
import CommentIcon from '@assets/icons/Comments.svg';
import TitleBar from '@components/TitleBar';
import PersonIcon from '@assets/icons/Person.svg';
import SendIcon from '@assets/icons/Send.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@components/Route';
import {boardApi} from '@api/boardApi';
import dayjs from 'dayjs';
import {BoardReplyType} from 'types/board';

type SearchScreenProps = NativeStackNavigationProp<RootStackParamList>;

const BoardDetailScreens = ({
  route,
  navigation,
}: {
  route: any;
  navigation: SearchScreenProps;
}) => {
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const {Idx} = route.params;

  const {
    data,
    isFetching,
    isLoading,
    refetch: boardRefetch,
  } = boardApi.GetBoardDetail(Idx);
  const {data: commentData, refetch} = boardApi.GetCommentList(Idx);

  const {mutate} = boardApi.PostComment();

  const [replyText, setReplyText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const replyInputRef = useRef<any>(null);
  const scrollViewRef = useRef<any>(null);

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
      () => {},
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleReplyPress = (commentId: number) => {
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
      const newReply = {
        boardIdx: Idx,
        parentIdx: replyCommentId,
        content: replyText,
      };
      mutate(newReply, {
        onSuccess: () => {
          refetch();
          boardRefetch();
          setReplyText('');
          setReplyCommentId(null);
        },
        onError: error => {
          console.error(error);
        },
      });
    }
  };

  const handleNewCommentSubmit = () => {
    if (newCommentText.trim() !== '') {
      const newComment = {
        boardIdx: Idx,
        parentIdx: null,
        content: newCommentText,
      };
      console.log('>>', newComment);
      mutate(newComment, {
        onSuccess: () => {
          refetch();
          boardRefetch();
          setNewCommentText('');
        },
        onError: error => {
          console.error(error);
        },
      });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    // Deletion logic here
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleBarContainer}>
          <TitleBar icon={'CloseIcon'} />
        </View>
        <View style={styles.divider} />
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          ref={scrollViewRef}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{data?.title}</Text>
            <Text style={styles.content}>{data?.content}</Text>
            <View style={styles.headerRow}>
              <PersonIcon style={styles.personIcon} width={40} height={40} />
              <View style={styles.headerColumn}>
                <Text style={styles.nickName}>{data?.createUserName}</Text>
                <Text style={styles.date}>
                  {dayjs(data?.createDt).format('YYYY-MM-DD')}
                </Text>
              </View>
              <CommentIcon style={styles.commentIcon} />
              <Text style={styles.commentCount}> {data?.commentCount}</Text>
            </View>
            <View style={styles.dividerWithMargin} />
            <Text style={styles.comment}>댓글</Text>
            <View style={styles.commentSection}>
              {commentData
                ?.filter(
                  (comment: BoardReplyType) => comment.parentIdx === null,
                )
                .map((comment: BoardReplyType) => (
                  <View key={comment.commentIdx}>
                    <View style={styles.commentRow}>
                      <PersonIcon
                        style={styles.commentPersonIcon}
                        width={40}
                        height={40}
                      />
                      <View style={styles.commentColumn}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentNickName}>
                            {comment.createUserName}
                          </Text>
                          <Text style={styles.commentDate}>
                            {dayjs(comment.createDt).format('YYYY-MM-DD')}
                          </Text>
                        </View>
                        <Text style={styles.commentContent}>
                          {comment.content}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteComment(comment.commentIdx)}>
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                    {commentData
                      ?.filter(
                        (reply: BoardReplyType) =>
                          reply.parentIdx === comment.commentIdx,
                      )
                      .map((reply: BoardReplyType) => (
                        <View
                          key={reply.commentIdx}
                          style={styles.replyContainer}>
                          <View style={styles.commentRow}>
                            <PersonIcon
                              style={styles.commentPersonIcon}
                              width={40}
                              height={40}
                            />
                            <View style={styles.commentColumn}>
                              <View style={styles.commentHeader}>
                                <Text style={styles.commentNickName}>
                                  {reply.createUserName}
                                </Text>
                                <Text style={styles.commentDate}>
                                  {dayjs(reply.createDt).format('YYYY-MM-DD')}
                                </Text>
                              </View>
                              <Text style={styles.commentContent}>
                                {reply.content}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() =>
                                handleDeleteComment(reply.commentIdx)
                              }>
                              <Text style={styles.deleteButtonText}>삭제</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    {replyCommentId === comment.commentIdx && (
                      <View style={styles.replyForm}>
                        <PersonIcon
                          style={styles.replyPersonIcon}
                          width={40}
                          height={40}
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
                            <SendIcon style={styles.searchicon} />
                          </Pressable>
                        </View>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.replyButton}
                      onPress={() => handleReplyPress(comment.commentIdx)}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                      <Text style={styles.replyButtonText}>
                        {replyCommentId === comment.commentIdx
                          ? '취소'
                          : '댓글달기'}
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
              <PersonIcon
                style={styles.replyPersonIcon}
                width={40}
                height={40}
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
                  <SendIcon style={styles.searchicon} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    marginRight: 7,
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
    height: 60,
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
    paddingLeft: 48,
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
    marginLeft: 40,
    marginBottom: 10,
  },
  replyContainer: {
    marginLeft: 40,
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
