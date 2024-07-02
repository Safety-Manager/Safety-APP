import React from 'react';
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
} from 'react-native';
import WriteIcon from '@assets/icons/Write.png';
import CommentIcon from '@assets/icons/Comments.png';
import PersonIcon from '@assets/icons/Person.png';
import {navigate} from '@utils/navigationRef';
import {RootStackParamList, RouteNames} from '@components/Route';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const DATA = [
  {
    id: '1',
    title: '자유게시판',
    content: 'Seeking for a data science intern to join our team.',
    nickName: '상구',
    date: '2023-04-13',
    comments: 3,
  },
  {
    id: '2',
    title: '자유게시판',
    content: 'Lunch order for today.',
    nickName: '미영',
    date: '2023-04-14',
    comments: 5,
  },
  {
    id: '2',
    title: '자유게시판',
    content: '안녕낭연연앙녀.',
    nickName: '니엥',
    date: '2023-04-14',
    comments: 5,
  },
  {
    id: '2',
    title: '자유게시판',
    content: 'Lunch order for today.',
    nickName: '미영',
    date: '2023-04-14',
    comments: 5,
  },
];

type ScreenProps = NativeStackNavigationProp<RootStackParamList>;

const BoardScreens = ({navigation}: {navigation: ScreenProps}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchbarContainer}>
        <TextInput
          style={styles.searchbarView}
          placeholderTextColor="black"
          placeholder="검색어를 입력해주세요."
        />
        <Pressable
          style={styles.searchButton}
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
            data={DATA}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate(RouteNames.BOARDDETAIL)}>
                <Text style={styles.title}>
                  산업 안전 보건령에 대한 질문이 있습니다.
                </Text>
                <Text style={styles.content}>
                  Seeking for a data science intern to josdsdin our tedsddsam.
                </Text>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={PersonIcon}
                    style={{width: 42, height: 42, marginRight: 10}}
                    resizeMode="contain"
                  />
                  <View style={{flexDirection: 'column', flex: 1}}>
                    <Text style={styles.nickName}>상구</Text>
                    <Text style={styles.date}>2023-04-13</Text>
                  </View>
                  <Image
                    source={CommentIcon}
                    style={{width: 24, height: 24, marginLeft: 10}}
                    resizeMode="contain"
                  />
                  <Text style={{fontSize: 16, lineHeight: 24, marginLeft: 5}}>
                    3
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() => navigation.navigate(RouteNames.BOARDWRITE)}>
          <Image
            style={{height: 24, width: 24}}
            resizeMode="cover"
            source={WriteIcon}
          />
        </TouchableOpacity>
      </View>
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
});

export default BoardScreens;
