import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import LeftLineIcon from '@assets/icons/LeftLine.png';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'App';

const TitleBar = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.headerBackButton}
      onPress={() => navigation.goBack()}>
      <Image
        source={LeftLineIcon}
        style={styles.leftLineIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default TitleBar;

const styles = StyleSheet.create({
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
});
