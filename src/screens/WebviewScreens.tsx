import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@components/Route';

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
      <WebView source={{uri: url}} style={styles.webView} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default WebViewScreen;
