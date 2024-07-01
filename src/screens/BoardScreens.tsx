import React from 'react';
import SearchIcon from '@assets/icons/Search.png';
import {
  Image,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import QnaScreens from './QnaScreens';
import FreeBoardScreens from './FreeBoardScreens';

const BoardScreens = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchbarContainer}>
        <TextInput
          style={styles.searchbarView}
          placeholderTextColor="black"
          placeholder="검색어를 입력해주세요."
        />
        <Pressable
          style={styles.searchButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Image
            source={SearchIcon}
            style={styles.searchicon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: '#CCCCCC',

          tabBarLabelStyle: {fontSize: 14, fontFamily: 'NotoSansCJKkr-Bold'},
          tabBarIndicatorStyle: {backgroundColor: '#000000'},
        }}>
        <Tab.Screen name="자유 게시판" component={FreeBoardScreens} />
        <Tab.Screen name="질의 응답" component={QnaScreens} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '##6B6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 80,
  },
  searchbarContainer: {
    position: 'relative',
    width: '90%',
    marginBottom: 10,
  },
  searchbarView: {
    borderRadius: 80,
    backgroundColor: '#ededed',
    height: 50,
    marginLeft: 20,
    width: '100%',
    paddingLeft: 15,
  },
  searchButton: {
    position: 'absolute',
    right: 1,
    top: 15,
  },
  searchicon: {
    width: 20,
    height: 20,
  },
});

export default BoardScreens;
