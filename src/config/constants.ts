// API
export const API_URL = process.env.REACT_APP_HOST;

//쿠키
const COOKIE_BASE_NAME = 'Bearer';

export const COOKIE_ACCESS_TOKEN = `${COOKIE_BASE_NAME}_accs`;
export const COOKIE_REFRESH_TOKEN = `${COOKIE_BASE_NAME}_rfrs`;
