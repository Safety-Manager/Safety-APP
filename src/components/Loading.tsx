import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>로딩중...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
