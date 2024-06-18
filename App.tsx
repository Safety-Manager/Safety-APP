import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreens from '@screens/MainScreens';
import WelcomeScreens from '@screens/WelcomeScreens';
import SearchInfoScreens from '@screens/SearchInfoScreens';
import SearchScreens from '@screens/SearchScreens';
import MyTabs from '@navigation/MyTabs';
import CodePush from 'react-native-code-push';
import {Button} from 'react-native';
import LawIcon from '@assets/icons/LatestLaw.png';

// 타입 정의
export type RootStackParamList = {
  Main: undefined;
  Welcome: undefined;
  Home: undefined;
  Search: {
    searchQuery: string;
    searchData: [{lawIdx: number; lawDocId: string; title: string}];
  };
  SearchInfo: {lawIdx: number}; // lawIdx가 필요하다면
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const queryClient = new QueryClient();

  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

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
            options={{headerShown: false, gestureEnabled: false, title: ''}}
          />
          <Stack.Screen
            name="SearchInfo"
            component={SearchInfoScreens}
            options={{
              headerShown: false,
              headerTitle: '',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  updateDialog: {
    title: '...',
    optionalUpdateMessage: '...',
    optionalInstallButtonLabel: '업데이트',
    optionalIgnoreButtonLabel: '아니요.',
  },
  installMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
