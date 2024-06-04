import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreens from '@screens/MainScreens';
import WelcomeScreens from '@screens/WelcomeScreens';
import SearchInfoScreens from '@screens/SearchInfoScreens';
import SearchScreens from '@screens/SearchScreens';
import MyTabs from '@navigation/MyTabs';

// 타입 정의
export type RootStackParamList = {
  Main: undefined;
  Welcome: undefined;
  Home: undefined;
  Search: {searchQuery: string};
  SearchInfo: {lawIdx: number}; // lawIdx가 필요하다면
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreens}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreens}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={MyTabs}
            options={{headerShown: false, gestureEnabled: false, title: ''}}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreens}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="SearchInfo"
            component={SearchInfoScreens}
            options={{title: ''}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
