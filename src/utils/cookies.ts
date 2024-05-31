import Cookies from '@react-native-cookies/cookies';

export const setCookie = async (url: string, cookie: any) => {
  await Cookies.set(url, cookie);
};

export const getCookie = async (url: string, name: any) => {
  const cookies = await Cookies.get(url);
  return cookies[name];
};
