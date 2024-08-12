import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Pressable,
  TextInput,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import CommentIcon from '@assets/icons/Comments.svg';
import TitleBar from '@components/TitleBar';
import PersonIcon from '@assets/icons/Person.svg';
import SendIcon from '@assets/icons/Send.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@components/Route';
import {boardApi} from '@api/boardApi';
import dayjs from 'dayjs';
import {BoardReplyType} from 'types/board';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '@components/CustomModal';
import _ from 'lodash';
import ReportModal from '@components/ReportModal';

type SearchScreenProps = NativeStackNavigationProp<RootStackParamList>;

const BoardDetailScreens = ({
  route,
  navigation,
}: {
  route: any;
  navigation: SearchScreenProps;
}) => {
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [replyLoading, setReplyLoading] = useState<number | null>(null); // 답글 로딩 상태 관리
  const [newCommentLoading, setNewCommentLoading] = useState(false); // 새 댓글 로딩 상태 관리

  const [ReportModalVisible, setReportModalVisible] = useState(false);
  const {Idx} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    onConfirm: () => void;
  }>({
    title: '',
    onConfirm: () => {},
  });

  const {
    data,
    isFetching,
    isLoading,
    refetch: boardRefetch,
  } = boardApi.GetBoardDetail(Idx);
  const {data: commentData, refetch} = boardApi.GetCommentList(Idx);

  const {mutate} = boardApi.PostComment();
  const {mutate: deleteMutate} = boardApi.DeleteComment();
  const {mutate: deletePostMutate} = boardApi.DeleteBoard();
  const {mutate: reportPostMutate} = boardApi.PostReport();

  const [replyText, setReplyText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const replyInputRef = useRef<any>(null);
  const scrollViewRef = useRef<any>(null);
  const [user, setUser] = useState({
    name: '',
    nickname: '',
    mobile: '',
    email: '',
    username: '',
  });

  const initUser = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  };

  useEffect(() => {
    initUser();
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
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
      setReplyText('');
    } else {
      setReplyCommentId(commentId);
      setTimeout(() => {
        if (replyInputRef.current) {
          replyInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleReplySubmit = useCallback(
    _.debounce(() => {
      if (replyText.trim() !== '') {
        const newReply = {
          boardIdx: Idx,
          parentIdx: replyCommentId,
          content: replyText,
        };
        setReplyLoading(replyCommentId); // 답글 로딩 상태 설정
        mutate(newReply, {
          onSuccess: () => {
            refetch();
            boardRefetch();
            setReplyText('');
            setReplyCommentId(null);
            setReplyLoading(null); // 답글 로딩 상태 해제
          },
          onError: error => {
            console.error(error);
            setReplyLoading(null); // 답글 로딩 상태 해제
          },
        });
      }
    }, 300),
    [replyText, replyCommentId, Idx, mutate, refetch, boardRefetch],
  );

  const handleNewCommentSubmit = useCallback(
    _.debounce(() => {
      if (newCommentText.trim() !== '') {
        const newComment = {
          boardIdx: Idx,
          parentIdx: null,
          content: newCommentText,
        };
        setNewCommentLoading(true); // 새 댓글 로딩 상태 설정
        mutate(newComment, {
          onSuccess: () => {
            refetch();
            boardRefetch();
            setNewCommentText('');
            setNewCommentLoading(false); // 새 댓글 로딩 상태 해제
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
            }
          },
          onError: error => {
            console.error(error);
            setNewCommentLoading(false); // 새 댓글 로딩 상태 해제
          },
        });
      }
    }, 300),
    [newCommentText, Idx, mutate, refetch, boardRefetch],
  );

  const handleDeleteComment = (commentId: number) => {
    deleteMutate(commentId, {
      onSuccess: () => {
        refetch();
        boardRefetch();
      },
      onError: error => {
        console.error(error);
      },
    });
  };

  const handleDeletePost = () => {
    setModalContent({
      title: '게시글을 삭제하시겠습니까?',
      onConfirm: muateDelete,
    });
    setModalVisible(true);
  };

  const muateDelete = () => {
    deletePostMutate(Idx, {
      onSuccess: () => {
        navigation.goBack();
      },
      onError: (error: any) => {
        console.error(error);
      },
    });
  };

  const muateReport = () => {
    reportPostMutate(
      {
        boardIdx: Idx,
        content: '신고합니다.',
        reportCategory: '게시글',
      },
      {
        onSuccess: () => {
          setModalVisible(false);
        },
        onError: (error: any) => {
          console.error(error);
        },
      },
    );
  };
  const handleReportPost = () => {
    setModalContent({
      title: '게시글을 신고하시겠습니까?',
      onConfirm: muateReport,
    });
    setModalVisible(true);
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
            <View style={styles.headerContainer}>
              <Text style={styles.title}>{data?.title}</Text>
              {data?.createUser === user.username ? (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeletePost}>
                  <Text style={styles.deleteButtonText}>게시글 삭제</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setReportModalVisible(true)}>
                  <Text style={styles.deleteButtonText}>게시글 신고</Text>
                </TouchableOpacity>
              )}
            </View>
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
                      {comment?.createUser === user.username && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() =>
                            handleDeleteComment(comment.commentIdx)
                          }>
                          <Text style={styles.deleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                      )}
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
                            {user.username === reply.createUser && (
                              <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() =>
                                  handleDeleteComment(reply.commentIdx)
                                }>
                                <Text style={styles.deleteButtonText}>
                                  삭제
                                </Text>
                              </TouchableOpacity>
                            )}
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
                          {replyLoading === comment.commentIdx && (
                            <ActivityIndicator size="small" color="#0000ff" />
                          )}
                          <Pressable
                            style={styles.searchButton}
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
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
                {newCommentLoading && (
                  <ActivityIndicator size="small" color="#0000ff" />
                )}
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
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        type={'confirm'}
        onConfirm={modalContent.onConfirm}
      />
      <ReportModal
        visible={ReportModalVisible}
        boardIdx={Idx}
        onClose={() => setReportModalVisible(false)}
      />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
    width: '75%',
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
    paddingVertical: 5,
    alignItems: 'flex-end',
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
