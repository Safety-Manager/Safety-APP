import React, {useCallback, useEffect, useState} from 'react';
import SearchIcon from '@assets/icons/Search.png';
import {
  Image,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Pressable,
  TextInput,
  Platform,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import WriteIcon from '@assets/icons/Write.svg';
import CommentIcon from '@assets/icons/Comments.svg';
import PersonIcon from '@assets/icons/Person.svg';
import {RootStackParamList, RouteNames} from '@components/Route';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {boardApi} from '@api/boardApi';
import {useFocusEffect} from '@react-navigation/native';
import dayjs from 'dayjs';
import CustomModal from '@components/CustomModal';

type ScreenProps = NativeStackNavigationProp<RootStackParamList>;

const BoardScreens = ({navigation}: {navigation: ScreenProps}) => {
  const [keyword, setKeyword] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = boardApi.GetBoardList(keyword); // Call without pageParam

  useFocusEffect(
    useCallback(() => {
      refetch(); // 페이지가 포커스될 때마다 refetch 함수 호출
      const backAction = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [refetch]),
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const renderFooter = () => {
    if (isFetchingNextPage || isLoading) {
      return <ActivityIndicator />;
    }
    if (!hasNextPage) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>데이터가 없습니다</Text>
        </View>
      );
    }
    return null;
  };

  const onClickSearch = () => {
    if (keyword === '') {
      setModalVisible(true);
      setModalContent({
        title: '검색어를 입력 해 주세요.',
        onConfirm: () => setModalVisible(false),
      });
    } else {
      refetch();
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchbarContainer}>
        <TextInput
          style={styles.searchbarView}
          placeholderTextColor="black"
          onChangeText={(text: string) => setKeyword(text)}
          value={keyword}
          placeholder="검색어를 입력해주세요."
        />
        <Pressable
          style={styles.searchButton}
          onPress={onClickSearch}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Image
            source={SearchIcon}
            style={styles.searchicon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View style={styles.safeArea}>
        <View style={styles.CardContainer}>
          <FlatList
            data={data?.pages.flatMap(page => page)}
            onEndReached={() => {
              if (hasNextPage) {
                fetchNextPage();
              }
            }}
            contentContainerStyle={{flexGrow: 1}}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            keyExtractor={item => item.boardIdx.toString()}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() =>
                  navigation.navigate(RouteNames.BOARDDETAIL, {
                    Idx: item.boardIdx,
                  })
                }>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <PersonIcon width={42} height={42} />
                  <View
                    style={{flexDirection: 'column', flex: 1, marginLeft: 10}}>
                    <Text style={styles.nickName}>{item.createUserName}</Text>
                    <Text style={styles.date}>
                      {dayjs(item.createDt).format('YYYY-MM-DD')}
                    </Text>
                  </View>
                  <CommentIcon
                    style={{width: 24, height: 24, marginLeft: 10}}
                  />
                  <Text style={{fontSize: 16, lineHeight: 24, marginLeft: 5}}>
                    {item.commentCount}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() => navigation.navigate(RouteNames.BOARDWRITE)}>
          <WriteIcon style={{height: 24, width: 24}} />
        </TouchableOpacity>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '##6B6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 80,
  },
  searchbarContainer: {
    marginTop: 20,
    position: 'relative',
    width: '90%',
    marginBottom: 10,
  },
  searchbarView: {
    borderRadius: 80,
    backgroundColor: '#ededed',
    height: 50,
    marginLeft: 20,
    width: '100%',
    paddingLeft: 15,
  },
  searchButton: {
    position: 'absolute',
    right: 1,
    top: 15,
  },
  searchicon: {
    width: 20,
    height: 20,
  },
  CardContainer: {
    flexDirection: 'column',
    marginTop: 5,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'column',
    marginHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#fff', // 카드 배경색 추가
    padding: 15, // 카드 내부 여백 추가
    gap: Platform.OS === 'ios' ? 10 : 0,
    marginVertical: 10, // 카드 상하 여백 추가
    shadowColor: '#000', // 그림자 색상 추가 (iOS)
    shadowOffset: {width: 0, height: 4}, // 그림자 오프셋 추가 (iOS)
    shadowOpacity: 0.1, // 그림자 불투명도 추가 (iOS)fPersonIcon
    shadowRadius: 6, // 그림자 반경 추가 (iOS)
    elevation: 4, // 그림자 높이 추가 (Android)
    borderColor: '#e0e0e0', // 테두리 색상 추가
    borderWidth: 1, // 테두리 두께 추가
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
  },
  content: {
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#6b6b6b',
    flexShrink: 1,
  },
  nickName: {
    alignSelf: 'stretch',
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#121417',
  },
  date: {
    alignSelf: 'stretch',
    fontSize: 12,
    lineHeight: 21,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#637587',
  },
  writeBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#000',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#ccc',
    marginBottom: 10,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BoardScreens;
