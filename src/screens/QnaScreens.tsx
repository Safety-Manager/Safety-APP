import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import WriteIcon from '@assets/icons/Write.png';
import CommentIcon from '@assets/icons/Comments.png';
import Person from '@assets/icons/Person.png';

const QnaScreens = () => {
  return (
    <View style={styles.safeArea}>
      <Text>QnaScreens</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default QnaScreens;
