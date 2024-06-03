import {lawApi} from '@api/lawApi';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';

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
      <h1>${title}</h1>
      <div class="category">카테고리 : ${category}</div>
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

const SearchInfoScreens = ({route}: {route: any}) => {
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
      <WebView originWhitelist={['*']} source={{html: htmlContent}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
