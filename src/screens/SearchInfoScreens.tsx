import {lawApi} from '@api/lawApi';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import LeftLineIcon from '@assets/icons/LeftLine.png';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';

// 텍스트 데이터를 HTML로 변환하는 함수
const generateHtmlContent = (
  title: string,
  content: string,
  category: string,
) => {
  let htmlContent = `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 10px;
              background-color: #f4f4f4;
          }
          h1 {
            color: #333;
            font-size: 18px; /* 글자 크기 조정 */
            text-align: center;
            margin-bottom: 20px;
        }
          .content {
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .category {
            color: #333;
            font-size: 14px; /* 글자 크기 조정 */
            text-align: center;
            margin-bottom: 20px;
          }
          ul {
              padding-left: 20px;
          }
          li {
              margin-bottom: 10px;
          }
      </style>
  </head>
  <body>
      <div class="content">
          <ul>
  `;

  // 텍스트를 HTML 형식으로 변환
  const formattedContent = content
    .replace(/\n/g, '<br>')
    .replace(/\t/g, '<span class="indent"></span>');

  htmlContent += formattedContent;

  htmlContent += `
          </ul>
      </div>
  </body>
  </html>
  `;

  return htmlContent;
};

type SearchScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  'SearchInfo'
>;

const SearchInfoScreens = ({
  route,
  navigation,
}: {
  route: any;
  navigation: SearchScreenProps;
}) => {
  const {lawIdx} = route.params;
  const [lawInfo, setLawInfo] = useState({
    title: '',
    content: '',
    category: '',
  });

  const {data, isFetching, isLoading} = lawApi.GetLawInfo(lawIdx);

  useEffect(() => {
    if (data) {
      setLawInfo({
        title: data?.title,
        content: data?.hilightContent,
        category: '산업안전보건법',
      });
    }
  }, [data]);

  if (isFetching || isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>로딩중...</Text>
      </SafeAreaView>
    );
  }

  const htmlContent = generateHtmlContent(
    lawInfo.title,
    lawInfo.content,
    lawInfo.category,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: 'white',
        }}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}>
          <Image
            source={LeftLineIcon}
            style={styles.leftLineIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.text}>{data?.title}</Text>
        <View style={styles.lineView} />
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 20,
            paddingLeft: 20,
          }}>
          <Text style={styles.categoryText}>카테고리</Text>
          <View style={styles.rectangleView}>
            <Text>안업안전보건법</Text>
          </View>
        </View>
      </View>
      <WebView originWhitelist={['*']} source={{html: htmlContent}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
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
  text: {
    paddingTop: 66,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000',
    textAlign: 'center',
  },
  lineView: {
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderTopWidth: 1,
    flex: 1,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    height: 1,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#000',
  },
  rectangleView: {
    borderRadius: 50,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#bbb',
    borderWidth: 1,
    flex: 1,
    width: '100%',
    height: 35,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default SearchInfoScreens;
