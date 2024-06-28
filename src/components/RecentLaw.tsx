import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import NodataIcon from '@assets/icons/NoData.png';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, RouteNames} from './Route';

interface RecentLawProps {
  data: any;
}

type SearchScreenProps = NativeStackNavigationProp<RootStackParamList>;

const RecentLaw = ({data}: RecentLawProps) => {
  const navigation: SearchScreenProps = useNavigation(); // Use the useNavigation hook to access the navigation object

  const onClickSearchInfo = (lawIdx: number) => {
    navigation.navigate(RouteNames.SEARCHINFO, {
      lawIdx: lawIdx,
    });
  };

  return (
    <>
      {data?.length > 0 ? (
        <>
          {data.map((list: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => onClickSearchInfo(list.lawIdx)}>
              <View style={styles.LowCard}>
                <View style={{marginLeft: 20}}>
                  <Text style={styles.LowCardTittle}>제목</Text>
                  <Text
                    style={styles.LowCardTittleInfo}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {list.title}
                  </Text>
                  <View style={styles.LowLine} />
                  <Text style={styles.LowCardTittle}>카테고리</Text>
                  <Text
                    style={styles.LowCardTittleInfo}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {list.category ?? '카테고리 없음'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={NodataIcon}
            style={{height: 32, width: 32, marginBottom: 10}}></Image>
          <Text style={styles.noDataText}>최근 조회한 이력이 없습니다.</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  LowCard: {
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    width: 251,
    height: Platform.OS === 'ios' ? 170 : 200,
    marginRight: 10,
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
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderTopWidth: 1,
    flex: 1,
  },
  noDataText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#ccc',
    marginBottom: 35,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});

export default RecentLaw;
