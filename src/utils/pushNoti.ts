import {AppState} from 'react-native';
import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';

const displayNotification = async (message: any) => {
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: '카테고리 이름',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_launcher', //
      asForegroundService: true,
    },
    ios: {
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    },
  });
};

export default {
  displayNoti: (remoteMessage: any) => displayNotification(remoteMessage),
};
