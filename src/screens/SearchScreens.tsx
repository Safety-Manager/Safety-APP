import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {lawApi} from '@api/lawApi';

const SearchScreens = ({route, navigation}: {route: any; navigation: any}) => {
  const {searchQuery} = route.params; // Assuming `searchQuery` is passed correctly

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage} =
    lawApi.GetLawList(searchQuery, 1); // Call without pageParam

  console.log('searchQuery>>>', searchQuery);
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

  const onClickSearchInfo = (lawIdx: number) => {
    navigation.navigate('SearchInfo', {
      lawIdx: lawIdx,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.pages.flatMap(page => page)}
        keyExtractor={item => item.lawDocId.toString()}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  LowCard: {
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    width: 251,
    height: 170,
    marginRight: 10,
    marginBottom: 10,
  },
  LowCardTittle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr',
    color: '#bbb',
    marginTop: 15,
    marginBottom: 4,
  },
  LowCardTittleInfo: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
    color: '#000',
    marginBottom: 12,
    paddingRight: 38,
    textAlign: 'left',
  },
  LowLine: {
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
    marginBottom: 35,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});

export default SearchScreens;
