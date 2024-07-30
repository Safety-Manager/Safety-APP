import React from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@components/Route';
import TitleBar from '@components/TitleBar';

type WebViewScreenProps = NativeStackNavigationProp<RootStackParamList>;

const WebViewScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: WebViewScreenProps;
}) => {
  const {url, title} = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={{
          width: '100%',
          height: 50,
          backgroundColor: 'white',
        }}>
        <TitleBar />
      </View>
      <WebView source={{uri: url}} style={styles.webView} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    height: '100%',
    flex: 1,
    backgroundColor: 'white',
  },
  webView: {
    flex: 1,
  },
});

export default WebViewScreen;
