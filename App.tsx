import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import MainScreens from '@screens/MainScreens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreens from '@screens/WelcomeScreens';
import SearchInfoScreens from '@screens/SearchInfoScreens';
import SearchScreens from '@screens/SearchScreens';
import MyTabs from '@navigation/MyTabs';

export default function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const Stack = createNativeStackNavigator();

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
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SearchInfo"
            component={SearchInfoScreens}
            options={{title: '', headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
