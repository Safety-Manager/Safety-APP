import {View, Text, Button} from 'react-native';
import React from 'react';

const HomeScreens = ({navigation}: {navigation: any}) => {
  return (
    <View>
      <Button
        title="HomeScreens"
        onPress={() => {
          navigation.navigate('SearchInfo');
        }}
      />
      <Text>HomeScreens</Text>
    </View>
  );
};

export default HomeScreens;
