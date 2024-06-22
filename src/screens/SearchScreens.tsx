import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {lawApi} from '@api/lawApi';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';
import LawIcon from '@assets/icons/LatestLaw.png';
import UpIcon from '@assets/icons/UpBtn.png';
import TitleBar from '@components/TitleBar';
import {LawCountTypes} from 'types/law';

type SearchScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>;

const categoryData = [
  '전체',
  '산업안전보건법',
  '산업안전보건법 시행령',
  '산업안전보건법 시행규칙',
  '산업안전보건법 기준에 관한 규칙',
  '고시 · 훈령 · 예규',
  'KOSHA GUIDE',
];

const SearchScreens = ({
  route,
  navigation,
}: {
  route: any;
  navigation: SearchScreenProps;
}) => {
  const {searchQuery, category} = route.params; // Assuming `searchQuery` is passed correctly
  const [selectCategory, setSelectCategory] = useState(category); // Default category is '전체'

  const scrollToTop = (scrollViewRef: any) => {
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
  };
  const scrollViewRef = useRef<ScrollView>(null);

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} =
    lawApi.GetLawList(searchQuery, category); // Call without pageParam

  const {
    data: countData,
    isLoading,
    isFetching,
  } = lawApi.GetLawCategoryCount(category);
  const renderFooter = () => {
    if (isFetchingNextPage) {
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

  console.log('countData>>', countData);
  const onClickSearchInfo = (lawIdx: number) => {
    navigation.navigate('SearchInfo', {
      lawIdx: lawIdx,
    });
  };

  if (isFetching || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>로딩중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 120,
          backgroundColor: 'white',
        }}>
        <TitleBar />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rectangleContainer}>
          {countData?.map((item: LawCountTypes, index: number) => (
            <View
              key={index}
              style={
                selectCategory === item
                  ? styles.selectRectangleView
                  : styles.rectangleView
              }>
              <TouchableOpacity
                onPress={() => setSelectCategory(item.categoryDesc)}>
                <Text
                  style={
                    selectCategory === item ? styles.selectText : styles.text
                  }>
                  {item.categoryDesc} {item.count}건
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={{height: 10, backgroundColor: '#f2f2f2'}} />
      <View style={styles.contant}>
        <View style={{flexDirection: 'row', marginBottom: 10, paddingLeft: 20}}>
          <Image
            source={LawIcon}
            style={styles.LowIcons}
            resizeMode="contain"
          />
          <Text style={styles.LowText}>검색창</Text>
        </View>
        <FlatList
          data={data?.pages.flatMap(page => page)}
          keyExtractor={item => item.lawDocId.toString()}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          style={styles.flatListContentContainer}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          renderItem={({item}) => (
            <View style={styles.cardContainer}>
              <TouchableOpacity onPress={() => onClickSearchInfo(item.lawIdx)}>
                <View style={styles.LowCard}>
                  <View style={{marginLeft: 20}}>
                    <Text style={styles.LowCardTittle}>제목</Text>
                    <Text
                      style={styles.LowCardTittleInfo}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {item.title}
                    </Text>
                    <View style={styles.LowLine} />
                    <Text style={styles.LowCardTittle}>카테고리</Text>
                    <Text
                      style={styles.LowCardTittleInfo}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.category ?? '카테고리 없음'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.groupChild}
        onPress={() => scrollToTop(scrollViewRef)}>
        <Image resizeMode="contain" source={UpIcon} style={styles.icon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
  headerBackButton: {
    position: 'absolute',
    top: 21,
    left: 21,
    zIndex: 1,
  },
  leftLineIcon: {
    width: 21,
    height: 21,
  },
  rectangleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 65,
    paddingLeft: 20,
    paddingBottom: 30,
  },
  selectRectangleView: {
    borderRadius: 50,
    backgroundColor: '#404d60',
    flex: 1,
    width: '100%',
    paddingLeft: 13,
    paddingRight: 13,
    height: 35,
    justifyContent: 'center',
    marginRight: 5,
  },
  rectangleView: {
    borderRadius: 50,
    borderStyle: 'solid',
    borderColor: '#bbb',
    borderWidth: 1,
    flex: 1,
    width: '100%',
    paddingLeft: 13,
    paddingRight: 13,
    height: 35,
    justifyContent: 'center',
    marginRight: 5,
  },

  selectText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#ffff',
  },
  text: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#000',
  },
  contant: {
    width: '100%',
    height: '100%',
    paddingTop: 30,
    backgroundColor: 'white',
  },
  LowIcons: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  LowText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
  },
  flatListContentContainer: {
    paddingHorizontal: 20, // 양쪽에 20씩 패딩을 추가합니다
    height: '100%',
  },
  cardContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  LowCard: {
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    width: '100%',
    height: 170,
    marginBottom: 10,
  },
  LowCardTittle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#bbb',
    marginTop: 15,
    marginBottom: 4,
  },
  LowCardTittleInfo: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#000',
    marginBottom: 12,
    paddingRight: 38,
    textAlign: 'left',
  },
  LowLine: {
    justifyContent: 'center',
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderTopWidth: 1,
    flex: 1,
  },
  noDataText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
    color: '#ccc',
    marginBottom: 10,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupChild: {
    right: 20,
    width: 50,
    bottom: 26,
    position: 'absolute',
    height: 50,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default SearchScreens;
