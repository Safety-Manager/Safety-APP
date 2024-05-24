import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
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

const SearchInfoScreens = () => {
  const title = '제165조 권한 등의 위임ㆍ위탁';
  const content = `산업안전보건관리비 사용계획서                                                                                                                                               (앞 쪽)                                                                                                                                                                                 1. 일반사항                                                  발주자                       공사계                    금액 공사종류       [ ]일반건설(갑)       ① 재료비(관급별도)           (해당란에 √ 표) [ ]일반건설(을)                    [ ]중건설           ② 관급재료비                          [ ]철도 또는 궤도신설                [ ]특수 및 기타건설    ③ 직접노무비                                                                          ④ 그 밖의 사항             산업안전보건관리비               산업안전보건관리<em class='smart'>비</em> <em class='smart'>계</em>상                                      대상금액                                                [공사금액 중 ①+②+③]                                                                                                                               2. 항목별 실행계획                                             항목                               금액           비율(%)   안전관리자 등의 인건비 및 각종 업무수당 등                   %       안전시설비 등                                      %       개인보호구 및 안전장구 구입비 등                         %       안전진단비 등                                      %       안전ㆍ보건교육비 및 행사비 등                           %       근로자 건강관리비 등                                 %       건설재해 예방 기술지도비                               %       본사 사용비                                       %       총계                                            100%                                                               210㎜×297㎜[일반용지 60g/㎡(재활용품)]                                                                                                                                                                                                                                                                         (뒤쪽)                                                                                                                                                                            3. 세부 사용계획                                                항목                   세부항목단위수 량 금액산출 명세 사용시기   안전관리자 등의 인건비 및 각종                               업무수당 등                                           안전시설비 등                                          개인보호구 및 안전장구 구입비 등                             안전진단비 등                                          안전ㆍ보건교육비 및 행사비 등                               근로자 건강관리비 등                                     건설재해 예방 기술 지도비                                  본사 사용비"`;
  const category = '산업안전보건법';

  const htmlContent = generateHtmlContent(title, content, category);

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
});

export default SearchInfoScreens;
