import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import MyPage from '../screens/MyPageScreens';
import HomePage from '../screens/HomeScreens';
import SafetyCompany from '../screens/SafetyCompanyScreens';
import MypageIcon from '@assets/icons/Mypage.png';
import SafetyIcon from '@assets/icons/Safety.png';
import SearchIcon from '@assets/icons/Search.png';
import {Image, Platform, StyleSheet, Text} from 'react-native';

export default function MyTabs() {
  const Tab = createBottomTabNavigator();
  const isIphoneWithNotch = () => {
    const model = DeviceInfo.getModel();
    const notchDevices = [
      'iPhone X',
      'iPhone XR',
      'iPhone XS',
      'iPhone XS Max',
      'iPhone 11',
      'iPhone 11 Pro',
      'iPhone 11 Pro Max',
      'iPhone 12',
      'iPhone 12 Mini',
      'iPhone 12 Pro',
      'iPhone 12 Pro Max',
      'iPhone 13',
      'iPhone 13 Mini',
      'iPhone 13 Pro',
      'iPhone 13 Pro Max',
      'iPhone 14',
      'iPhone 14 Plus',
      'iPhone 14 Pro',
      'iPhone 14 Pro Max',
      'iPhone 15',
      'iPhone 15 Plus',
      'iPhone 15 Pro',
      'iPhone 15 Pro Max',
      'iPhone 16',
      'iPhone 16 Plus',
      'iPhone 16 Pro',
      'iPhone 16 Pro Max',
    ];
    return notchDevices.includes(model);
  };

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBarStyle,

          isIphoneWithNotch()
            ? styles.tabBarStyleNotch
            : styles.tabBarStyleDefault,
        ],
      }}>
      <Tab.Screen
        name="SafetyCompany"
        component={SafetyCompany}
        options={{
          tabBarLabel: ({color}) => (
            <Text style={[styles.tabBarLabel, {color}]}>안전교육</Text>
          ),
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Image
              source={SafetyIcon}
              style={{width: 27.58, height: 19.96, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: ({color}) => (
            <Text style={[styles.tabBarLabel, {color}]}>검색</Text>
          ),
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Image
              source={SearchIcon}
              style={{width: 22.69, height: 22.11, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          tabBarLabel: ({color}) => (
            <Text style={[styles.tabBarLabel, {color}]}>내 정보</Text>
          ),
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Image
              source={MypageIcon}
              style={{width: 22.37, height: 23.73, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'NotoSansCJKkr',
  },
  tabBarStyle: {
    borderTopWidth: 1, // 경계선 두께
    borderTopColor: '#CACACA', // 경계선 색상
    height: 75,
    paddingTop: 10,
    width: '100%',
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center', // 중앙 정렬
  },
  tabBarStyleNotch: {
    paddingBottom: 25, // Notch 있는 iPhone 모델
  },
  tabBarStyleDefault: {
    paddingBottom: 18, // Notch 없는 모델 및 기타 기기
  },
});
