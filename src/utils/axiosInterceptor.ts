import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://modusafe.site',
  headers: {
    'content-Type': 'application/json',

    // 필요시 추가 기본 헤더 설정
  },
});

// 인터셉터 예시
axiosInstance.interceptors.request.use(
  config => {
    const token = 'your_token_here'; // 토큰이 필요한 경우 설정
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 요청 오류 처리
    return Promise.reject(error);
  },
);

export default axiosInstance;
